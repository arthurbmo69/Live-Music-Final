<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $firebaseApiKey = "AIzaSyDO4iRz8nFyA5_4W6s1yRkRsXD2UN5-cAs";

    $url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$firebaseApiKey";

    $postData = [
        'email' => $email,
        'password' => $senha,
        'returnSecureToken' => true
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $result = json_decode($response, true);

    if ($httpCode === 200 && isset($result['idToken'])) {
        $_SESSION['user_email'] = $email;
        // ✅ Redirecionar para a página protegida
        header("Location: ../../Categorias/Categorias.php");
        exit();
    } else {
        $mensagem = $result['error']['message'] ?? 'Erro desconhecido';
        echo "Erro ao fazer login: $mensagem";
    }
}
?>
