# 🚀 РУКОВОДСТВО ДЛЯ РАЗРАБОТЧИКОВ

## **BACKEND РАЗРАБОТЧИКУ:**

### **📁 Файлы для Backend:**
```
backend/
├── program-config.js      # Конфигурация программы
├── pda-utils.js          # Утилиты для генерации PDA
├── api-routes.js         # API маршруты
└── database-schema.sql   # Схема базы данных
```

### **🔧 Установка зависимостей:**
```bash
npm install express @solana/web3.js @coral-xyz/anchor
```

### **📝 Использование:**
```javascript
// 1. Импорт конфигурации
const { PROGRAM_ID, NETWORK, ERROR_CODES } = require('./backend/program-config');

// 2. Генерация PDA
const { generateAssetPDAs } = require('./backend/pda-utils');
const { assetPda, escrowPda, revenuePoolPda } = generateAssetPDAs(assetId);

// 3. API маршруты
const apiRoutes = require('./backend/api-routes');
app.use('/api', apiRoutes);
```

### **🗄️ База данных:**
```sql
-- Запустите schema.sql для создания таблиц
psql -d your_database -f backend/database-schema.sql
```

---

## **FRONTEND РАЗРАБОТЧИКУ:**

### **📁 Файлы для Frontend:**
```
frontend/
├── config.js                    # Конфигурация
├── utils.js                     # Утилиты
├── App.jsx                      # Главный компонент
└── components/
    ├── CreateAssetForm.jsx      # Создание актива
    ├── BuyFractionsForm.jsx     # Покупка фракций
    └── AssetsList.jsx           # Список активов
```

### **🔧 Установка зависимостей:**
```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-phantom
npm install @solana/wallet-adapter-react-ui
```

### **📝 Использование:**
```jsx
// 1. Импорт компонентов
import CreateAssetForm from './components/CreateAssetForm';
import AssetsList from './components/AssetsList';

// 2. Использование в приложении
<CreateAssetForm wallet={wallet} onAssetCreated={handleAssetCreated} />
<AssetsList wallet={wallet} />
```

### **🎨 Стили:**
```css
/* Добавьте в App.css */
.create-asset-form { /* стили формы */ }
.asset-card { /* стили карточки актива */ }
.error-message { /* стили ошибок */ }
```

---

## **ОБЩИЕ ФАЙЛЫ:**

### **📋 Конфигурация:**
- **Program ID**: `FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ`
- **Network**: `devnet`
- **RPC URL**: `https://api.devnet.solana.com`

### **🔑 PDA Seeds:**
- **Asset**: `"asset" + assetId`
- **Escrow**: `"escrow" + assetPda`
- **Revenue Pool**: `"revenue_pool" + assetPda`

### **📊 API Endpoints:**
- `POST /api/assets` - Создание актива
- `POST /api/assets/:id/mint` - Выпуск токенов
- `POST /api/assets/:id/buy` - Покупка фракций
- `POST /api/assets/:id/distribute` - Распределение дохода
- `GET /api/assets/:id` - Информация об активе

### **⚠️ Обработка ошибок:**
- **6000**: InsufficientSupply
- **6001**: InsufficientTokenBalance
- **6002**: InvalidAmount
- **6003**: Unauthorized

---

## **БЫСТРЫЙ СТАРТ:**

### **Backend:**
1. Скопируйте файлы из `backend/`
2. Установите зависимости
3. Настройте базу данных
4. Запустите сервер

### **Frontend:**
1. Скопируйте файлы из `frontend/`
2. Установите зависимости
3. Настройте API URL
4. Запустите приложение

---

## **ПОДДЕРЖКА:**

- **Документация**: README.md
- **Адреса**: addresses.json
- **Тесты**: test-program.js
- **Примеры**: Все файлы содержат примеры использования

**Готово к интеграции! 🎉**
