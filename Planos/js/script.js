document.addEventListener('DOMContentLoaded', () => {
  const modalFormulario = document.getElementById('modal-checkout');
  const modalConfirmacao = document.getElementById('modal-confirmacao');
  const modalPlanoAtual = document.getElementById('modal-plano-atual');
  const planoEscolhido = document.getElementById('plano-escolhido');
  const form = document.getElementById('formulario-checkout');

  // Abrir modal com formulário ou alerta estilizado
  document.querySelectorAll('.plano button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent === 'Plano Atual') {
        modalPlanoAtual.classList.add('aberto');
        return;
      }

      const plano = btn.closest('.plano').querySelector('h2').textContent;
      planoEscolhido.textContent = plano;
      modalFormulario.classList.add('aberto');
    });
  });

  // Fechar modal de plano atual
  document.querySelector('#modal-plano-atual .fechar-modal').addEventListener('click', () => {
    modalPlanoAtual.classList.remove('aberto');
  });

  // Cancelar formulário
  document.querySelector('.modal .cancelar').addEventListener('click', () => {
    modalFormulario.classList.remove('aberto');
    form.reset();
  });

  // Confirmar formulário → abrir confirmação
  form.addEventListener('submit', e => {
    e.preventDefault();
    modalFormulario.classList.remove('aberto');
    modalConfirmacao.classList.add('aberto');
  });

  // Cancelar confirmação
  document.querySelector('.cancelar-final').addEventListener('click', () => {
    modalConfirmacao.classList.remove('aberto');
    modalFormulario.classList.add('aberto');
  });

  // Confirmar compra
  document.querySelector('.confirmar-final').addEventListener('click', () => {
    modalConfirmacao.classList.remove('aberto');
    form.reset();
  });

  // Máscara CPF
  const cpfInput = document.getElementById('cpf');
  cpfInput.addEventListener('input', () => {
    let valor = cpfInput.value.replace(/\D/g, '').substring(0, 11);
    if (valor.length > 9)
      valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (valor.length > 6)
      valor = valor.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    else if (valor.length > 3)
      valor = valor.replace(/^(\d{3})(\d+)/, '$1.$2');
    cpfInput.value = valor;
  });

  // Máscara Cartão
  const cartaoInput = document.getElementById('cartao');
  cartaoInput.addEventListener('input', () => {
    let valor = cartaoInput.value.replace(/\D/g, '').substring(0, 16);
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    cartaoInput.value = valor.trim();
  });

  // Confirmar compra
document.querySelector('.confirmar-final').addEventListener('click', () => {
  modalConfirmacao.classList.remove('aberto');

  // Atualizar plano atual
  const planoAtualNome = planoEscolhido.textContent;

  document.querySelectorAll('.plano').forEach(plano => {
    const titulo = plano.querySelector('h2').textContent;
    const botao = plano.querySelector('button');

    if (titulo === planoAtualNome) {
      botao.textContent = 'Plano Atual';
      botao.disabled = true;
      plano.classList.add('destaque');
    } else {
      botao.textContent = 'Assinar Agora';
      botao.disabled = false;
      plano.classList.remove('destaque');
    }
  });

  // Exibir mensagem estilizada
  const msg = document.getElementById('mensagem-sucesso');
  const nomePlano = document.getElementById('nome-plano-sucesso');
  nomePlano.textContent = planoAtualNome;
  msg.style.display = 'block';

  // Ocultar após 3 segundos
  setTimeout(() => {
    msg.style.display = 'none';
  }, 3000);

  form.reset();
});


  // Carrossel com índice dinâmico
  const slide = document.querySelector('.carrossel-slide');
  const grupos = document.querySelectorAll('.carrossel-slide .grupo-planos');
  const btnEsq = document.querySelector('.seta.esquerda');
  const btnDir = document.querySelector('.seta.direita');

  let slideIndex = 0;
  const totalSlides = grupos.length;

  function atualizarCarrossel() {
    const offset = -(slideIndex * 100);
    slide.style.transform = `translateX(${offset}%)`;
  }

  btnDir.addEventListener('click', () => {
    if (slideIndex < totalSlides - 1) {
      slideIndex++;
      atualizarCarrossel();
    }
  });

  btnEsq.addEventListener('click', () => {
    if (slideIndex > 0) {
      slideIndex--;
      atualizarCarrossel();
    }
  });
});
