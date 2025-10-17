// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Prompt Manager (agora com Groq) está funcionando!');
});

app.post('/send-to-ia', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }

    const apiKey = process.env.GROQ_API_KEY; 
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const requestBody = {
      model: 'llama-3.1-8b-instant', 
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(apiUrl, requestBody, { headers });

    const aiResponse = response.data.choices[0].message.content;

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Erro na resposta da API do Groq:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Falha ao se comunicar com a IA do Groq.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});