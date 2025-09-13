#!/bin/bash

# ЗАПУСК ПРОДАКШЕН ВЕРСИИ - Asset Tokenization Platform
# ====================================================

echo "🚀 ЗАПУСК ПРОДАКШЕН ВЕРСИИ - Asset Tokenization Platform"
echo "========================================================"

# Проверяем, что мы в правильной директории
if [ ! -f "test-production.js" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории asset_tokenization"
    exit 1
fi

echo "✅ Директория найдена"

# Устанавливаем зависимости для продакшен backend
echo "📦 Устанавливаем зависимости для продакшен backend..."
cd production-backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Запускаем продакшен API сервер
echo "🌐 Запускаем продакшен API сервер..."
cd production-backend
node src/index.js &
API_PID=$!
cd ..

# Ждем запуска сервера
sleep 5

# Проверяем, что сервер запустился
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Продакшен API сервер запущен на http://localhost:3001"
else
    echo "❌ Ошибка запуска продакшен API сервера"
    exit 1
fi

echo ""
echo "🎯 ПРОДАКШЕН ВЕРСИЯ ГОТОВА К ИСПОЛЬЗОВАНИЮ!"
echo "============================================="
echo ""
echo "📋 API ЭНДПОИНТЫ:"
echo "  Health Check: http://localhost:3001/health"
echo "  Create Asset: POST http://localhost:3001/api/assets/create_asset"
echo "  Mint Tokens:  POST http://localhost:3001/api/assets/mint_fraction"
echo "  Buy Fractions: POST http://localhost:3001/api/transactions/buy_fraction"
echo "  Distribute Revenue: POST http://localhost:3001/api/transactions/distribute_revenue"
echo "  Get Asset: GET http://localhost:3001/api/assets/:assetId"
echo "  List Assets: GET http://localhost:3001/api/assets"
echo "  Get Transaction: GET http://localhost:3001/api/transactions/:transactionId"
echo ""
echo "🧪 ТЕСТИРОВАНИЕ:"
echo "  Запустите: node test-production.js"
echo ""
echo "🛑 ОСТАНОВКА:"
echo "  Нажмите Ctrl+C для остановки сервера"
echo ""

# Запускаем тест
echo "🧪 Запускаем тест продакшен версии..."
node test-production.js

echo ""
echo "🎉 ПРОДАКШЕН ТЕСТ ЗАВЕРШЕН!"
echo "==========================="
echo "API сервер работает в фоне (PID: $API_PID)"
echo "Для остановки: kill $API_PID"
