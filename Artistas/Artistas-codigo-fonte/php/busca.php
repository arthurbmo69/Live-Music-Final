<?php
// Permite requisições de outros domínios (caso necessário)
header('Content-Type: application/json');

$termo = strtolower(trim($_GET['q'] ?? ''));

if ($termo === '') {
    echo json_encode([]);
    exit;
}

// Carrega dados (poderia ser um banco MySQL também)
$musicas = json_decode(file_get_contents('./dados/musicas.json'), true);

$resultados = array_filter($musicas, function($musica) use ($termo) {
    return strpos(strtolower($musica['titulo']), $termo) !== false;
});

echo json_encode(array_values($resultados));
