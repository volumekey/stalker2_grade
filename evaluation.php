<?php
// Проверяем наличие параметра id
if (!isset($_GET['id'])) {
    echo 'Не указан ID оценки';
    exit;
}

$id = $_GET['id'];

// Путь к файлу с оценкой
$file = __DIR__ . '/evaluations/' . $id . '.json';

if (!file_exists($file)) {
    echo 'Оценка не найдена';
    exit;
}

$data = json_decode(file_get_contents($file), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Ошибка при декодировании данных оценки';
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Оценка <?php echo htmlspecialchars($id); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            margin-bottom: 10px;
        }
        .rating {
            margin-bottom: 10px;
        }
        .comment {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>Оценка</h1>
    <div class="section">
        <h2>Рейтинги</h2>
        <?php foreach ($data['ratings'] as $rating): ?>
            <div class="rating">
                <strong><?php echo htmlspecialchars($rating['label']); ?></strong><br>
                Оценка: <?php echo htmlspecialchars($rating['value']); ?> из <?php echo htmlspecialchars($rating['max']); ?><br>
                <?php if (!empty(trim($rating['info']))): ?>
                    Комментарий: <?php echo nl2br(htmlspecialchars($rating['info'])); ?>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
    <div class="section">
        <h2>Комментарии</h2>
        <?php
        // Отображаем только поля "МИНУСЫ" и "ПЛЮСЫ"
        foreach ($data['content'] as $fieldLabel => $text):
            if (in_array($fieldLabel, ['МИНУСЫ', 'ПЛЮСЫ'])):
        ?>
            <div class="comment">
                <strong><?php echo htmlspecialchars($fieldLabel); ?></strong><br>
                <?php echo nl2br(htmlspecialchars($text)); ?>
            </div>
        <?php
            endif;
        endforeach;
        ?>
    </div>
</body>
</html>
