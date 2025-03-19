<?php
header('Content-Type: application/json');

// Разрешаем только POST-запросы
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

// Получаем входящие данные (ожидается JSON)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректные JSON-данные']);
    exit;
}

// Проверяем наличие обязательных полей (ratings и content)
if (!isset($data['ratings']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Отсутствуют необходимые поля']);
    exit;
}

// Генерируем уникальный идентификатор для оценки
$id = uniqid();

// Указываем директорию для сохранения оценок
$directory = __DIR__ . '/evaluations';
if (!file_exists($directory)) {
    mkdir($directory, 0777, true);
}

// Сохраняем данные оценки в JSON-файл
$file = $directory . '/' . $id . '.json';
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT)) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось сохранить оценку']);
    exit;
}

// Возвращаем успешный ответ с id оценки
echo json_encode(['id' => $id]);
?>
