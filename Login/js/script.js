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
  e.preventDefault(); // ✅ Não recarrega a página

  const form = e.target;
  const formData = new FormData(form);
  const mensagemDiv = document.getElementById('mensagem');

  try {
    const resposta = await fetch('php/registrar.php', {
      method: 'POST',
      body: formData
    });

    const texto = await resposta.text();
    mensagemDiv.innerHTML = texto;

  } catch (erro) {
    mensagemDiv.innerHTML = '<p class="erro">Erro ao registrar. Tente novamente.</p>';
  }
});


