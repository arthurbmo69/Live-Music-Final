const input = document.querySelector('.barra-pesquisa');
const lista = document.querySelector('.resultados-pesquisa');
const audio = document.getElementById('audio-player');
const capaPlayer = document.querySelector('.capa-musica');
const nomeMusica = document.querySelector('.nome-musica');
const nomeArtista = document.querySelector('.nome-artista');
const botaoPlay = document.querySelector('.botao-play');
const player = document.querySelector('.player');

input.addEventListener('input', async () => {
  const termo = input.value.trim();
  lista.innerHTML = '';

  if (termo.length === 0) return;

  const resposta = await fetch(`busca.php?q=${encodeURIComponent(termo)}`);
  const musicas = await resposta.json();

  musicas.forEach(musica => {
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
      lista.innerHTML = '';
      input.value = '';
    });
    lista.appendChild(li);
  });
});
