document.addEventListener('DOMContentLoaded', () => {
  // Elementos do player de áudio
  const volumeSlider = document.querySelector('.barra-volume');
  const waves = document.querySelectorAll('.volume-waves .wave');
  const botaoPlay = document.querySelector('.botao-play');
  const barraProgresso = document.querySelector('.barra-progresso');
  const progresso = document.querySelector('.progresso');
  const audio = document.getElementById('audio-player');
  const tempoInicio = document.querySelector('.tempo-inicio');
  const tempoFim = document.querySelector('.tempo-fim');
  const capaPlayer = document.querySelector('.capa-musica');
  const nomeMusica = document.querySelector('.nome-musica');
  const nomeArtista = document.querySelector('.nome-artista');
  const player = document.querySelector('.player');

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
    volumeSlider.addEventListener('input', function() {
      atualizarCorVolume(this.value);
      if (audio) audio.volume = this.value / 100;
    });
  }

  // ---- Controles de reprodução ----
  if (botaoPlay && audio) {
    botaoPlay.addEventListener('click', () => {
      if (audio.paused) {
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
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (audio.paused) {
        audio.play();
        botaoPlay.textContent = '⏸';
      } else {
        audio.pause();
        botaoPlay.textContent = '▶';
      }
    }
  });

  // ---- Barra de progresso ----
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

  // ---- Controle manual da barra de progresso ----
  if (barraProgresso && progresso && audio) {
    let arrastando = false;

    barraProgresso.addEventListener('click', (e) => {
      const percent = e.offsetX / barraProgresso.clientWidth;
      progresso.style.width = `${percent * 100}%`;
      audio.currentTime = percent * audio.duration;
    });

    barraProgresso.addEventListener('mousedown', () => arrastando = true);
    document.addEventListener('mousemove', (e) => {
      if (arrastando) {
        const rect = barraProgresso.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        progresso.style.width = `${percent * 100}%`;
        audio.currentTime = percent * audio.duration;
      }
    });
    document.addEventListener('mouseup', () => arrastando = false);
  }

  // ---- Formatação de tempo ----
  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' + seg : seg}`;
  }

  // ---- Tocar música ao clicar na lista ----
  document.querySelectorAll('.item-musica').forEach(musica => {
    musica.addEventListener('click', (event) => {
      if (event.target.closest('button') && !event.target.classList.contains('btn-play-individual')) return;

      const botaoPlayIndividual = musica.querySelector('.btn-play-individual');
      if (!botaoPlayIndividual) return;

      const { src, title, artist, cover } = botaoPlayIndividual.dataset;
      if (src && title && artist && cover) {
        audio.src = src;
        audio.play();
        botaoPlay.textContent = '⏸';
        nomeMusica.textContent = title;
        nomeArtista.textContent = artist;
        capaPlayer.src = cover;
        player.classList.add('player-visivel');
      }
    });
  });

  // ---- Sistema de Pesquisa Avançado ----
  const barraPesquisa = document.querySelector('.barra-pesquisa');
  const listaResultados = document.querySelector('.resultados-pesquisa');

  // Funções auxiliares para pesquisa
  function normalizeText(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function highlightText(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="destaque-pesquisa">$1</span>');
  }

function sortByRelevance(results, term) {
    const termNorm = normalizeText(term);
    return [...results].sort((a, b) => {
      const aTitle = normalizeText(a.titulo);
      const aArtist = normalizeText(a.artista);
      const bTitle = normalizeText(b.titulo);
      const bArtist = normalizeText(b.artista);

      const aScore = (aTitle === termNorm ? 2 : 0) + 
                    (aArtist === termNorm ? 1 : 0) +
                    (aTitle.startsWith(termNorm) ? 1 : 0);
      const bScore = (bTitle === termNorm ? 2 : 0) + 
                    (bArtist === termNorm ? 1 : 0) +
                    (bTitle.startsWith(termNorm) ? 1 : 0);

      return bScore - aScore;
    });
  }

  barraPesquisa.addEventListener('input', async () => {
    const termo = barraPesquisa.value.trim();
    listaResultados.innerHTML = '';

    if (termo.length === 0) return;

    try {
      const resposta = await fetch('/Artistas/Artistas-codigo-fonte/Dados/musicas.json');
      const musicas = await resposta.json();

      const termoNormalizado = normalizeText(termo);
      const resultados = musicas.filter(m => 
        normalizeText(m.titulo).includes(termoNormalizado) || 
        normalizeText(m.artista).includes(termoNormalizado)
      );

      const resultadosOrdenados = sortByRelevance(resultados, termo);

      resultadosOrdenados.forEach(musica => {
        const li = document.createElement('li');
        li.classList.add('resultado-item');
        
        const img = document.createElement('img');
        img.src = musica.capa;
        img.alt = `Capa de ${musica.titulo}`;
        
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info-musica-pesquisa');
        
        const titulo = document.createElement('span');
        titulo.classList.add('titulo-musica-pesquisa');
        titulo.innerHTML = highlightText(musica.titulo, termo);
        
        const artista = document.createElement('span');
        artista.classList.add('artista-musica-pesquisa');
        artista.innerHTML = highlightText(musica.artista, termo);
        
        infoDiv.appendChild(titulo);
        infoDiv.appendChild(artista);
        
        li.appendChild(img);
        li.appendChild(infoDiv);
        
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

// Adiciona evento de clique nos artistas
document.querySelectorAll('.artista-card').forEach(artista => {
  artista.addEventListener('click', (e) => {
    const nomeArtista = artista.querySelector('.artista-nome').textContent;
    // Aqui você pode redirecionar para a página do artista
    // Por exemplo: window.location.href = `/Artista/${encodeURIComponent(nomeArtista)}`;
    console.log(`Redirecionando para o artista: ${nomeArtista}`);
    // Implemente a lógica de redirecionamento conforme sua estrutura de arquivos
  });
});