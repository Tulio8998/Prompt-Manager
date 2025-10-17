const STORAGE_KEY = 'prompts_storage';

const state = {
  prompts: [],
  selectedId: null,
}

const elements = {
  promptTitle: document.getElementById('prompt-title'),
  promptContent: document.getElementById('prompt-content'),
  titleWrapper: document.getElementById('title-wrapper'),
  contentWrapper: document.getElementById('content-wrapper'),
  btnOpen: document.getElementById('btn-open'),
  btnCollapse: document.getElementById('btn-collapse'),
  btnSave: document.getElementById('btn-save'),
  list: document.getElementById('prompts-list'),
  searchInput: document.getElementById('search-input'),
  btnNew: document.getElementById('btn-new'),
  btnCopy: document.getElementById('btn-copy'),
  btnImport: document.getElementById('btn-import'),
  aiResponse: document.getElementById('ai-response')
};

const converter = new showdown.Converter();

function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0;
  wrapper.classList.toggle('is-empty', !hasText);
}

function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper);
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper);
}

function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper);
  });
  elements.promptContent.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper);
  });
}

function copySelected(){
  try {
    const content = elements.promptContent;
    return navigator.clipboard.writeText(content.innerHTML);
  } catch (error) {
    console.error('Erro ao copiar para a área de transferência:', error);
  }
}

function init() {
  attachAllEditableHandlers();
  updateAllEditableStates();
}

elements.btnNew.addEventListener('click', () => {
  state.selectedId = null;
  elements.promptTitle.textContent = '';
  elements.promptContent.innerHTML = '';
  elements.aiResponse.textContent = '';
  updateAllEditableStates();
  elements.promptTitle.focus();
});

elements.btnSave.addEventListener('click', () => {
  const title = elements.promptTitle.textContent.trim();
  const content = elements.promptContent.textContent.trim();
  const hasContent = elements.promptContent.textContent.trim();

  if (!title || !hasContent) {
    alert('O título e o conteúdo não podem estar vazios.');
    return;
  }

  if (state.selectedId) {
    const promptToUpdate = state.prompts.find(p => p.id === state.selectedId);
    if (promptToUpdate) {
      promptToUpdate.title = title;
      promptToUpdate.content = content;
    }
  } else {
    const newPrompt = { id: Date.now(), title, content, response: '' };
    state.prompts.unshift(newPrompt);
    state.selectedId = newPrompt.id;
  }

  persist();
  renderList();
  alert('Prompt salvo com sucesso!');
});

elements.btnCopy.addEventListener('click', () => {
  const contentToCopy = elements.promptContent.innerText;
  
  if (!contentToCopy) {
    alert('Não há conteúdo para copiar.');
    return;
  }

  navigator.clipboard.writeText(contentToCopy)
    .then(() => {
      const buttonText = elements.btnCopy.querySelector('.text');
      buttonText.textContent = 'Copiado!';
      
      setTimeout(() => {
        buttonText.textContent = 'Copiar';
      }, 2000);
    })
    .catch(err => {
      console.error('Falha ao copiar o texto: ', err);
      alert('Não foi possível copiar o conteúdo.');
    });
});

elements.btnImport.addEventListener('click', async () => {
  const selectedId = state.selectedId;

  if (!selectedId) {
    alert('Por favor, salve e selecione um prompt antes de enviar para a IA.');
    return;
  }

  const contentToImport = elements.promptContent.innerText;

  if (!contentToImport) {
    alert('Não há conteúdo para enviar.');
    return;
  }

  const buttonText = elements.btnImport;
  buttonText.textContent = 'Enviando...';
  elements.btnImport.disabled = true;
  elements.aiResponse.textContent = ''; 

  try {
    const response = await fetch('http://localhost:3000/send-to-ia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: contentToImport }),
    });

    if (!response.ok) {
      throw new Error('Falha na comunicação com o servidor.');
    }

    const data = await response.json();

    const htmlResponse = converter.makeHtml(data.response);
    elements.aiResponse.innerHTML = htmlResponse;

    const promptToUpdate = state.prompts.find(p => p.id === selectedId);
    if (promptToUpdate) {
      promptToUpdate.response = data.response;
      persist();
    }

  } catch (error) {
    console.error('Erro ao importar prompt:', error);
    alert('Não foi possível enviar o prompt.');
  } finally {
    buttonText.textContent = 'Importar';
    elements.btnImport.disabled = false;
  }
});

elements.searchInput.addEventListener('input', (event) => {
  const filter = event.target.value;
  renderList(filter);
});

elements.list.addEventListener('click', (event) => {
  const removeBtn = event.target.closest('[data-remove="remove"]');
  const selectAction = event.target.closest('[data-action="select"]');

  if (removeBtn) {
    const item = removeBtn.closest('[data-id]');
    const id = Number(item.getAttribute('data-id'));
    
    state.prompts = state.prompts.filter(p => p.id !== id);

    if (state.selectedId === id) {
      elements.promptTitle.textContent = '';
      elements.promptContent.innerHTML = '';
      elements.aiResponse.innerHTML = '';
      state.selectedId = null;
      updateAllEditableStates();
    }

    persist();
    renderList(elements.searchInput.value);
    
  } else if (selectAction) {
    const item = selectAction.closest('[data-id]');
    const id = Number(item.getAttribute('data-id'));
    const prompt = state.prompts.find(p => p.id === id);

    if (prompt) {
      elements.promptTitle.textContent = prompt.title;
      elements.promptContent.innerHTML = prompt.content;
      
      
      const htmlResponse = converter.makeHtml(prompt.response || '');
      elements.aiResponse.innerHTML = htmlResponse;
      
      state.selectedId = prompt.id;
      updateAllEditableStates();
      renderList(elements.searchInput.value);
    }
  }
});

function persist(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

function loadState() {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);  
      state.prompts = parsedState.prompts || [];
      state.selectedId = parsedState.selectedId || null;
    }
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
  }
}

function createPromptItem(prompt) {
  return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
      <div class="prompt-item-content">
        <span class="prompt-item-title">${prompt.title}</span>
        <span class="prompt-item-description">${prompt.content}</span>
      </div>
      <button class="btn-icon" title="Remover" data-remove="remove">
        <img src="assets/remove.svg" alt="Remover" class="icon icon-trash" />
      </button>
    </li>
  `;
}

function renderList(filter = '') {
  const filteredPrompts = state.prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(filter.toLowerCase()) || 
    prompt.content.toLowerCase().includes(filter.toLowerCase())
  ).map(p => createPromptItem(p)).join('');

  elements.list.innerHTML = filteredPrompts;
}

init();
loadState();
renderList("");
const sidebar = document.querySelector('.sidebar');
const app = document.querySelector('.app');

function openSidebar() {
  sidebar.classList.add('open');
  
  sidebar.style.display = 'flex';
  elements.btnOpen.style.display = 'none';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  
  sidebar.style.display = 'none';
  elements.btnOpen.style.display = 'block';
}

if (elements.btnOpen) {
  elements.btnOpen.addEventListener('click', openSidebar);
}
if (elements.btnCollapse) {
  elements.btnCollapse.addEventListener('click', closeSidebar);
}
