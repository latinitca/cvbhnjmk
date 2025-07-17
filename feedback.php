<?php include 'php/db_connect.php'; ?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Обратная связь</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="hs-header">
    <!-- Шапка -->
  </header>

  <main class="hs-main">
    <section class="feedback-section">
      <h1>Обратная связь</h1>
      
      <?php if (isset($_GET['success'])): ?>
        <div class="alert success">Сообщение отправлено!</div>
      <?php endif; ?>

      <form action="php/process_feedback.php" method="POST">
        <input type="text" name="name" placeholder="Имя" required>
        <input type="email" name="email" placeholder="Email" required>
        <textarea name="message" placeholder="Сообщение" required></textarea>
        <button type="submit" class="hs-button">Отправить</button>
      </form>

      <div class="messages-list">
        <h2>Последние отзывы</h2>
        <?php
          $result = $conn->query("SELECT * FROM feedback ORDER BY id DESC LIMIT 5");
          while ($row = $result->fetch_assoc()):
        ?>
          <div class="message">
            <h3><?= htmlspecialchars($row['name']) ?></h3>
            <p><?= htmlspecialchars($row['message']) ?></p>
          </div>
        <?php endwhile; ?>
      </div>
    </section>
  </main>

  <footer class="hs-footer">
    <!-- Подвал -->
  </footer>
</body>
</html>