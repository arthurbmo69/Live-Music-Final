<?php
require __DIR__ . '/../../vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;

$factory = (new Factory)->withServiceAccount(__DIR__ . '/banco-live-music-firebase-adminsdk-fbsvc-d5bc01704json.json');
$auth = $factory->createAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $nome = $_POST['nome'] ?? '';

    if (strlen($senha) < 6) {
        echo '<p class="erro">A senha deve conter pelo menos 6 caracteres.</p>';
        exit;
    }

    try {
        $userProperties = [
            'email' => $email,
            'emailVerified' => false,
            'password' => $senha,
            'displayName' => $nome,
            'disabled' => false,
        ];

        $createdUser = $auth->createUser($userProperties);
        echo '<p class="sucesso">✅ Usuário criado com sucesso!</p>';

    } catch (\Kreait\Firebase\Exception\AuthException $e) {
        echo '<p class="erro">Erro ao criar usuário: ' . $e->getMessage() . '</p>';
    }
}
?>
