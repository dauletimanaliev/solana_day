// ПРОСТОЙ HTTP СЕРВЕР ДЛЯ UI
// ==========================

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3003;

// Принудительное обновление кэша
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Главная страница - Humanity UI (ДО статических файлов!)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'humanity-ui.html'));
});

// Статические файлы
app.use(express.static(path.join(__dirname)));

// Старая версия
app.get('/old', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🎨 UI сервер запущен на http://localhost:${PORT}`);
    console.log(`📱 Откройте браузер и перейдите по адресу выше`);
});
