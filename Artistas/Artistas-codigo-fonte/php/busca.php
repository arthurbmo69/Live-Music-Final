<?php
header('Content-Type: application/json');

function normalizeText($text) {
    $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text);
    $text = preg_replace('/[^a-zA-Z0-9\s]/', '', $text);
    return strtolower(trim($text));
}

$termo = normalizeText($_GET['q'] ?? '');

if ($termo === '') {
    echo json_encode([]);
    exit;
}

$musicas = json_decode(file_get_contents('./dados/musicas.json'), true);

$resultados = array_filter($musicas, function($musica) use ($termo) {
    $titulo = normalizeText($musica['titulo']);
    $artista = normalizeText($musica['artista']);
    return strpos($titulo, $termo) !== false || strpos($artista, $termo) !== false;
});

echo json_encode(array_values($resultados));