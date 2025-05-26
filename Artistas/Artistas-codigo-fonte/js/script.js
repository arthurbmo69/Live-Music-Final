document.addEventListener('DOMContentLoaded', () => {
  const volumeSlider = document.querySelector('.barra-volume');
  const waves = document.querySelectorAll('.volume-waves .wave');
  const botaoPlay = document.querySelector('.botao-play');
  const barraProgresso = document.querySelector('.barra-progresso');
  const progresso = document.querySelector('.progresso');
  const audio = document.getElementById('audio-player');
  const tempoInicio = document.querySelector('.tempo-inicio');
  const tempoFim = document.querySelector('.tempo-fim');

  // ---- Volume com ondas ----
  function atualizarCorVolume(valor) {
    const porcentagem = `${valor}%`;
    volumeSlider.style.background = `linear-gradient(to right, #fff ${porcentagem}, #535353 ${porcentagem})`;

    const alturaMaxima = 14;
    const alturaMinima = 4;
    const altura = alturaMinima + ((alturaMaxima - alturaMinima) * (valor / 100));

    waves.forEach((wave, index) => {
      const incremento = index * 2;
      wave.style.height = `${altura + incremento}px`;
      wave.style.opacity = valor > 0 ? '1' : '0.2';
    });
  }

  if (volumeSlider) {
    atualizarCorVolume(volumeSlider.value);

    volumeSlider.addEventListener('input', function () {
      atualizarCorVolume(this.value);
      if (audio) {
        audio.volume = this.value / 100;
      }
    });
  }

  // ---- Botão Play/Pause central ▶ ⏸ ----
  if (botaoPlay && audio) {
    botaoPlay.addEventListener('click', () => {
      const isPlayIcon = botaoPlay.textContent.trim() === '▶';

      if (isPlayIcon) {
        audio.play();
        botaoPlay.textContent = '⏸';
      } else {
        audio.pause();
        botaoPlay.textContent = '▶';
      }
    });
  }

// ---- Atalho: Barra de espaço para Play/Pause ----
document.addEventListener('keydown', (e) => {
  // Ignora se estiver digitando em campos de input/textarea
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;

  if (e.code === 'Space') {
    e.preventDefault(); // evita rolagem da página
    if (audio.paused) {
      audio.play();
      botaoPlay.textContent = '⏸';
    } else {
      audio.pause();
      botaoPlay.textContent = '▶';
    }
  }
});

  
  // ---- Atualiza tempo total e tempo atual ----
  if (audio && progresso && tempoInicio && tempoFim) {
    audio.addEventListener('loadedmetadata', () => {
      tempoFim.textContent = formatarTempo(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progresso.style.width = `${percent}%`;
      tempoInicio.textContent = formatarTempo(audio.currentTime);
    });
  }

  // ---- Clique e arraste na barra de progresso ----
  if (barraProgresso && progresso && audio) {
    barraProgresso.addEventListener('click', (e) => {
      const larguraBarra = barraProgresso.clientWidth;
      const cliqueX = e.offsetX;
      const percent = cliqueX / larguraBarra;
      progresso.style.width = `${percent * 100}%`;
      audio.currentTime = percent * audio.duration;
    });

    let arrastando = false;

    barraProgresso.addEventListener('mousedown', (e) => {
      arrastando = true;
      atualizarProgresso(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (arrastando) {
        atualizarProgresso(e);
      }
    });

    document.addEventListener('mouseup', () => {
      arrastando = false;
    });

    function atualizarProgresso(e) {
      const rect = barraProgresso.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const largura = barraProgresso.clientWidth;
      const percent = Math.max(0, Math.min(1, offsetX / largura));
      progresso.style.width = `${percent * 100}%`;
      audio.currentTime = percent * audio.duration;
    }
  }

  // ---- Formata segundos para mm:ss ----
  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' + seg : seg}`;
  }

  // ---- Favoritar músicas ----
  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('favorito');
      btn.textContent = btn.classList.contains('favorito') ? '🤍' : '♡';
    });
  });

  // ---- Tocar música ao clicar na div ou botão ----
  const musicas = document.querySelectorAll('.item-musica');
  const capaPlayer = document.querySelector('.capa-musica');
  const nomeMusica = document.querySelector('.nome-musica');
  const nomeArtista = document.querySelector('.nome-artista');
  const player = document.querySelector('.player');

  musicas.forEach(musica => {
    musica.addEventListener('click', (event) => {
      if (event.target.closest('button') && !event.target.classList.contains('btn-play-individual')) return;

      const botaoPlayIndividual = musica.querySelector('.btn-play-individual');
      if (!botaoPlayIndividual) return;

      const src = botaoPlayIndividual.dataset.src;
      const title = botaoPlayIndividual.dataset.title;
      const artist = botaoPlayIndividual.dataset.artist;
      const cover = botaoPlayIndividual.dataset.cover;

      if (src && title && artist && cover) {
        audio.src = src;
        audio.play();
        botaoPlay.textContent = '⏸';

        nomeMusica.textContent = title;
        nomeArtista.textContent = artist;
        capaPlayer.src = cover;

        // Exibe o player se estiver oculto
        player.classList.add('player-visivel');
      }
    });
  });

const barraPesquisa = document.querySelector('.barra-pesquisa');
const listaResultados = document.querySelector('.resultados-pesquisa');

barraPesquisa.addEventListener('input', async () => {
  const termo = barraPesquisa.value.trim().toLowerCase();
  listaResultados.innerHTML = '';

  if (termo.length === 0) return;

  try {
    const resposta = await fetch('/Artistas/Artistas-codigo-fonte/Dados/musicas.json');
    const musicas = await resposta.json();

    const resultados = musicas.filter(m => m.titulo.toLowerCase().includes(termo));

    resultados.forEach(musica => {
      const li = document.createElement('li');
      li.classList.add('resultado-item');
      li.textContent = `${musica.titulo} - ${musica.artista}`;
      li.addEventListener('click', () => {
        audio.src = musica.src;
        audio.play();
        nomeMusica.textContent = musica.titulo;
        nomeArtista.textContent = musica.artista;
        capaPlayer.src = musica.capa;
        botaoPlay.textContent = '⏸';
        player.classList.add('player-visivel');
        listaResultados.innerHTML = '';
        barraPesquisa.value = '';
      });
      listaResultados.appendChild(li);
    });

  } catch (erro) {
    console.error('Erro ao carregar músicas:', erro);
  }
});
});