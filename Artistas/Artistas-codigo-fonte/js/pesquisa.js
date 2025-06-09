const input = document.querySelector('.barra-pesquisa');
const lista = document.querySelector('.resultados-pesquisa');
const audio = document.getElementById('audio-player');
const capaPlayer = document.querySelector('.capa-musica');
const nomeMusica = document.querySelector('.nome-musica');
const nomeArtista = document.querySelector('.nome-artista');
const botaoPlay = document.querySelector('.botao-play');
const player = document.querySelector('.player');

// Função para normalizar texto (remover acentos)
function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '');
}

// Função para destacar o termo pesquisado
function highlightText(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<span class="destaque-pesquisa">$1</span>');
}

// Função para ordenar por relevância
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

input.addEventListener('input', async () => {
  const termo = input.value.trim();
  lista.innerHTML = '';

  if (termo.length === 0) return;

  try {
    const resposta = await fetch(`busca.php?q=${encodeURIComponent(termo)}`);
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
        lista.innerHTML = '';
        input.value = '';
      });
      
      lista.appendChild(li);
    });

  } catch (erro) {
    console.error('Erro ao buscar músicas:', erro);
  }
});