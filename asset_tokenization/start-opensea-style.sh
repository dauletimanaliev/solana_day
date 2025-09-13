#!/bin/bash

# ЗАПУСК OPENSEA-СТИЛЬ ПРОДУКТА
# =============================

echo "🚀 ЗАПУСК OPENSEA-СТИЛЬ ПРОДУКТА"
echo "================================="

# Проверяем, что мы в правильной директории
if [ ! -f "test-production.js" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории asset_tokenization"
    exit 1
fi

echo "✅ Директория найдена"

# 1. Устанавливаем зависимости для API
echo "📦 Устанавливаем зависимости для API..."
cd simple-production-backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# 2. Устанавливаем зависимости для UI
echo "📦 Устанавливаем зависимости для UI..."
cd ui
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# 3. Запускаем API сервер
echo "🌐 Запускаем API сервер..."
cd simple-production-backend
node src/index.js &
API_PID=$!
cd ..

# 4. Запускаем UI сервер
echo "🎨 Запускаем OpenSea-стиль UI сервер..."
cd ui
node server.js &
UI_PID=$!
cd ..

# Ждем запуска серверов
sleep 5

# Проверяем, что серверы запустились
echo "🔍 Проверяем статус серверов..."

# Проверяем API
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ API сервер запущен на http://localhost:3001"
else
    echo "❌ Ошибка запуска API сервера"
    exit 1
fi

# Проверяем UI
if curl -s http://localhost:3003 > /dev/null; then
    echo "✅ OpenSea-стиль UI запущен на http://localhost:3003"
else
    echo "❌ Ошибка запуска UI сервера"
    exit 1
fi

echo ""
echo "🎯 OPENSEA-СТИЛЬ ПРОДУКТ ЗАПУЩЕН!"
echo "================================="
echo ""
echo "📋 СЕРВИСЫ:"
echo "  🌐 API Server: http://localhost:3001"
echo "  🎨 UI Server:  http://localhost:3003"
echo "  📊 Health:     http://localhost:3001/health"
echo ""
echo "🔗 ФУНКЦИИ OPENSEA-СТИЛЬ:"
echo "  🔌 Connect Wallet - Phantom, Solflare, Backpack"
echo "  🏠 Explore - Просмотр активов по категориям"
echo "  ➕ Create - Создание новых активов"
echo "  🛒 Buy - Покупка токенов активов"
echo "  📊 Stats - Статистика и аналитика"
echo "  🎨 Dark Theme - Темная тема как у OpenSea"
echo ""
echo "🌐 ОТКРЫТЬ В БРАУЗЕРЕ:"
echo "  UI: http://localhost:3003"
echo "  API: http://localhost:3001"
echo ""
echo "🛑 ОСТАНОВКА:"
echo "  Нажмите Ctrl+C для остановки всех серверов"
echo "  Или выполните: kill $API_PID $UI_PID"
echo ""

# Открываем браузер
echo "🌐 Открываем браузер с OpenSea-стиль UI..."
open http://localhost:3003

echo ""
echo "🎉 OPENSEA-СТИЛЬ ПРОДУКТ ГОТОВ!"
echo "==============================="
echo "API сервер работает в фоне (PID: $API_PID)"
echo "UI сервер работает в фоне (PID: $UI_PID)"
echo ""
echo "Для остановки всех серверов:"
echo "kill $API_PID $UI_PID"
