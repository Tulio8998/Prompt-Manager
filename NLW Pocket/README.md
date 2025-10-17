# 🚀 Prompt Manager - NLW Pocket

## 📖 Sobre o Projeto

O **Prompt Manager** é uma aplicação web completa desenvolvida como parte da trilha da **NLW Pocket**, um evento da [Rocketseat](https://www.rocketseat.com.br/). O projeto foi criado para ser uma ferramenta prática e intuitiva, permitindo que usuários criem, salvem e organizem seus prompts de Inteligência Artificial em um só lugar.

Após a conclusão do evento, o projeto foi aprimorado com uma integração full-stack, conectando a interface a uma IA real para gerar, exibir e salvar respostas diretamente na aplicação.

---

## ✨ Funcionalidades Principais

-   **CRUD de Prompts:** Crie, edite, salve e remova prompts de forma simples.
-   **Busca Dinâmica:** Filtre e encontre prompts instantaneamente pelo título ou conteúdo.
-   **Persistência de Dados:** Todos os seus prompts são salvos localmente no navegador usando `localStorage`.
-   **Integração com IA:** Envie um prompt para uma IA (através da API gratuita do Groq) e receba a resposta em tempo real.
-   **Visualização e Armazenamento de Respostas:** As respostas geradas pela IA são exibidas em formato HTML (convertido de Markdown) e salvas junto com o prompt original para consulta futura.
-   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, garantindo uma boa experiência tanto no desktop quanto em dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack moderna, dividida entre front-end e back-end.

### **Front-end**

-   **HTML5** (Estrutura semântica)
-   **CSS3** (Estilização com Flexbox, variáveis e design responsivo)
-   **JavaScript (ES6+)** (Manipulação do DOM, gerenciamento de estado e lógica da aplicação)
-   **Showdown.js** (Biblioteca para converter as respostas em Markdown da IA para HTML)

### **Back-end**

-   **Node.js** (Ambiente de execução)
-   **Express.js** (Framework para criação do servidor e da rota da API)
-   **Axios** (Cliente HTTP para fazer requisições para a API externa)
-   **Dotenv** (Para gerenciamento seguro das chaves de API)
-   **CORS** (Para permitir a comunicação entre front-end e back-end)

### **Serviços Externos**

-   **Groq API** (Serviço de inferência de IA, utilizando o modelo `llama-3.1-8b-instant`)

---

## ⚙️ Como Executar o Projeto Localmente

Para rodar este projeto em sua máquina, siga os passos abaixo.

### **Pré-requisitos**

-   [Node.js](https://nodejs.org/en/) instalado.
-   Um editor de código, como o [VS Code](https://code.visualstudio.com/), com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

### **Passo a Passo**

1.  **Clone o repositório:**
    ```bash
    git clone [https://seu-link-para-o-repositorio.git](https://seu-link-para-o-repositorio.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd NLW-Pocket
    ```

3.  **Instale as dependências do back-end:**
    ```bash
    npm install
    ```

4.  **Configure suas variáveis de ambiente:**
    -   Crie um arquivo chamado `.env` na raiz do projeto.
    -   Adicione sua chave da API do Groq neste arquivo:
        ```
        GROQ_API_KEY="SUA_CHAVE_API_DO_GROQ_AQUI"
        ```

5.  **Inicie o servidor back-end:**
    -   Abra um terminal e execute o comando:
        ```bash
        node server.js
        ```
    -   Você deverá ver a mensagem `Servidor rodando em http://localhost:3000`. Deixe este terminal aberto.

6.  **Inicie a aplicação front-end:**
    -   Em outro terminal (ou diretamente no VS Code), clique com o botão direito no arquivo `index.html`.
    -   Selecione a opção **"Open with Live Server"**.
    -   Seu navegador abrirá a aplicação e ela estará pronta para uso!

---