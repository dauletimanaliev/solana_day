#!/bin/bash

# ЗАПУСК ПОЛНОГО ПРОДАКШЕН ПРОДУКТА
# =================================

echo "🚀 ЗАПУСК ПОЛНОГО ПРОДАКШЕН ПРОДУКТА"
echo "===================================="

# Проверяем, что мы в правильной директории
if [ ! -f "test-production.js" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории asset_tokenization"
    exit 1
fi

echo "✅ Директория найдена"

# 1. Устанавливаем зависимости для продакшен backend
echo "📦 Устанавливаем зависимости для продакшен backend..."
cd production-backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# 2. Устанавливаем зависимости для продакшен frontend
echo "📦 Устанавливаем зависимости для продакшен frontend..."
cd production-frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# 3. Запускаем продакшен API сервер
echo "🌐 Запускаем продакшен API сервер..."
cd production-backend
node src/index.js &
API_PID=$!
cd ..

# 4. Запускаем продакшен frontend
echo "🎨 Запускаем продакшен frontend..."
cd production-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Ждем запуска серверов
sleep 8

# Проверяем, что серверы запустились
echo "🔍 Проверяем статус серверов..."

# Проверяем API
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Продакшен API сервер запущен на http://localhost:3001"
else
    echo "❌ Ошибка запуска продакшен API сервера"
    exit 1
fi

# Проверяем Frontend
if curl -s http://localhost:3002 > /dev/null; then
    echo "✅ Продакшен Frontend запущен на http://localhost:3002"
else
    echo "❌ Ошибка запуска продакшен Frontend"
    exit 1
fi

echo ""
echo "🎯 ПОЛНЫЙ ПРОДАКШЕН ПРОДУКТ ЗАПУЩЕН!"
echo "===================================="
echo ""
echo "📋 СЕРВИСЫ:"
echo "  🌐 API Server: http://localhost:3001"
echo "  🎨 Frontend:   http://localhost:3002"
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
echo "  Frontend: http://localhost:3002"
echo "  API Health: http://localhost:3001/health"
echo ""
echo "🛑 ОСТАНОВКА:"
echo "  Нажмите Ctrl+C для остановки всех серверов"
echo "  Или выполните: kill $API_PID $FRONTEND_PID"
echo ""

# Открываем браузер
echo "🌐 Открываем браузер..."
open http://localhost:3002

# Запускаем тест
echo "🧪 Запускаем тест продакшен версии..."
node test-production.js

echo ""
echo "🎉 ПОЛНЫЙ ПРОДАКШЕН ПРОДУКТ ГОТОВ!"
echo "=================================="
echo "API сервер работает в фоне (PID: $API_PID)"
echo "Frontend работает в фоне (PID: $FRONTEND_PID)"
echo ""
echo "Для остановки всех серверов:"
echo "kill $API_PID $FRONTEND_PID"
