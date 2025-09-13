#!/bin/bash

# ЗАПУСК ПРОСТОЙ ПРОДАКШЕН ВЕРСИИ
# ===============================

echo "🚀 ЗАПУСК ПРОСТОЙ ПРОДАКШЕН ВЕРСИИ"
echo "=================================="

# Проверяем, что мы в правильной директории
if [ ! -f "test-production.js" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории asset_tokenization"
    exit 1
fi

echo "✅ Директория найдена"

# Устанавливаем зависимости для простого backend
echo "📦 Устанавливаем зависимости для простого backend..."
cd simple-production-backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Запускаем простой API сервер
echo "🌐 Запускаем простой API сервер..."
cd simple-production-backend
node src/index.js &
API_PID=$!
cd ..

# Ждем запуска сервера
sleep 3

# Проверяем, что сервер запустился
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Простой API сервер запущен на http://localhost:3001"
else
    echo "❌ Ошибка запуска простого API сервера"
    exit 1
fi

echo ""
echo "🎯 ПРОСТАЯ ПРОДАКШЕН ВЕРСИЯ ГОТОВА!"
echo "==================================="
echo ""
echo "📋 СЕРВИСЫ:"
echo "  🌐 API Server: http://localhost:3001"
echo "  📊 Health:     http://localhost:3001/health"
echo ""
echo "🔗 API ЭНДПОИНТЫ:"
echo "  POST /api/assets/create_asset"
echo "  POST /api/assets/mint_fraction"
echo "  GET  /api/assets/:assetId"
echo "  GET  /api/assets"
echo "  POST /api/transactions/buy_fraction"
echo "  POST /api/transactions/distribute_revenue"
echo "  GET  /api/transactions/:transactionId"
echo ""
echo "🧪 ТЕСТИРОВАНИЕ:"
echo "  Запустите: node test-production.js"
echo ""
echo "🌐 ОТКРЫТЬ В БРАУЗЕРЕ:"
echo "  API Health: http://localhost:3001/health"
echo ""
echo "🛑 ОСТАНОВКА:"
echo "  Нажмите Ctrl+C для остановки сервера"
echo "  Или выполните: kill $API_PID"
echo ""

# Запускаем тест
echo "🧪 Запускаем тест простой продакшен версии..."
node test-production.js

echo ""
echo "🎉 ПРОСТАЯ ПРОДАКШЕН ВЕРСИЯ ГОТОВА!"
echo "==================================="
echo "API сервер работает в фоне (PID: $API_PID)"
echo "Для остановки: kill $API_PID"
