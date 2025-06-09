const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

// Mostrar o formulário automaticamente ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    wrapper.classList.add('active-popup');
});

document.getElementById('formRegistro').addEventListener('submit', async function (e) {
  e.preventDefault(); // Não recarrega a página

  const form = e.target;
  const formData = new FormData(form);
  
  // Remove mensagens antigas
  const oldAlert = document.querySelector('.alert');
  if (oldAlert) oldAlert.remove();

  try {
    const resposta = await fetch('php/registrar.php', {
      method: 'POST',
      body: formData
    });

    const texto = await resposta.text();
    
    // Cria o elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    
    // Extrai a classe (sucesso ou erro) da resposta
    const isSuccess = texto.includes('sucesso');
    alertDiv.classList.add(isSuccess ? 'success' : 'error');
    alertDiv.innerHTML = `
      ${texto.replace(/<p class="(sucesso|erro)">|<\/p>/g, '')}
      <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Mostra o alerta com animação
    setTimeout(() => alertDiv.classList.add('show'), 10);
    
    // Fecha o alerta após 5 segundos ou quando clicar no X
    const closeBtn = alertDiv.querySelector('.close-btn');
    const closeAlert = () => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 400);
    };
    
    closeBtn.addEventListener('click', closeAlert);
    setTimeout(closeAlert, 5000);
    
    // Se for sucesso, limpa o formulário após 1 segundo
    if (isSuccess) {
      setTimeout(() => form.reset(), 1000);
    }

  } catch (erro) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert error show';
    alertDiv.innerHTML = `
      Erro ao registrar. Tente novamente.
      <span class="close-btn">&times;</span>
    `;
    document.body.appendChild(alertDiv);
    
    const closeBtn = alertDiv.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => alertDiv.remove());
    setTimeout(() => alertDiv.remove(), 5000);
  }
});


