<?php
require __DIR__ . '/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Exception\Auth\EmailExists;

header("Content-Type: text/html; charset=utf-8");

// Configuração do Firebase
$factory = (new Factory)
    ->withServiceAccount(__DIR__.'/firebase-credentials.json')
    ->withDatabaseUri('https://SEU-PROJETO.firebaseio.com');

$auth = $factory->createAuth();
$response = "";

try {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    // Validações básicas
    if (empty($nome) || empty($email) || empty($senha)) {
        throw new Exception('Todos os campos são obrigatórios.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('E-mail inválido.');
    }

    if (strlen($senha) < 6) {
        throw new Exception('A senha deve ter pelo menos 6 caracteres.');
    }

    // Verifica se o e-mail já está cadastrado
    try {
        $existingUser = $auth->getUserByEmail($email);
        $response = '<p class="erro">Este e-mail já está registrado. Use outro e-mail ou faça login.</p>';
    } catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
        // Se o usuário não existe, prossegue com o registro
        $userProperties = [
            'email' => $email,
            'emailVerified' => false,
            'password' => $senha,
            'displayName' => $nome,
            'disabled' => false,
        ];

        $createdUser = $auth->createUser($userProperties);
        $response = '<p class="sucesso">Registro realizado! Bem-vindo, ' . htmlspecialchars($nome) . '.</p>';
    }

} catch (Exception $e) {
    $response = '<p class="erro">Erro: ' . htmlspecialchars($e->getMessage()) . '</p>';
}

echo $response;
?>