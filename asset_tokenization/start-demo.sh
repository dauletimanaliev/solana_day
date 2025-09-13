#!/bin/bash

# ДЕМО ЗАПУСК - Asset Tokenization Platform
# ========================================

echo "🚀 ЗАПУСК ДЕМО - Asset Tokenization Platform"
echo "============================================="

# Проверяем, что мы в правильной директории
if [ ! -f "simple-api.js" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории asset_tokenization"
    exit 1
fi

echo "✅ Директория найдена"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install express cors
fi

# Запускаем API сервер
echo "🌐 Запускаем API сервер..."
node simple-api.js &
API_PID=$!

# Ждем запуска сервера
sleep 3

# Проверяем, что сервер запустился
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ API сервер запущен на http://localhost:3000"
else
    echo "❌ Ошибка запуска API сервера"
    exit 1
fi

echo ""
echo "🎯 ДЕМО ГОТОВО К ИСПОЛЬЗОВАНИЮ!"
echo "==============================="
echo ""
echo "📋 API ЭНДПОИНТЫ:"
echo "  Health Check: http://localhost:3000/health"
echo "  Create Asset: POST http://localhost:3000/api/assets/create_asset"
echo "  Mint Tokens:  POST http://localhost:3000/api/assets/mint_fraction"
echo "  Buy Fractions: POST http://localhost:3000/api/transactions/buy_fraction"
echo "  Distribute Revenue: POST http://localhost:3000/api/transactions/distribute_revenue"
echo "  Get Asset: GET http://localhost:3000/api/assets/:assetId"
echo "  List Assets: GET http://localhost:3000/api/assets"
echo ""
echo "🧪 ТЕСТИРОВАНИЕ:"
echo "  Запустите: node test-integration.js"
echo ""
echo "🛑 ОСТАНОВКА:"
echo "  Нажмите Ctrl+C для остановки сервера"
echo ""

# Запускаем тест
echo "🧪 Запускаем тест интеграции..."
node test-integration.js

echo ""
echo "🎉 ДЕМО ЗАВЕРШЕНО!"
echo "=================="
echo "API сервер работает в фоне (PID: $API_PID)"
echo "Для остановки: kill $API_PID"
