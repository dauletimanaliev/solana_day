# 🚀 РУКОВОДСТВО ПО ДЕПЛОЮ ДЛЯ BLOCKCHAIN DEVELOPER

## **ЧТО ДОЛЖЕН ДЕЛАТЬ BLOCKCHAIN DEVELOPER:**

### **1. ПОДГОТОВКА К ДЕПЛОЮ:**

#### **Проверка окружения:**
```bash
# Проверить версию Solana CLI
solana --version

# Проверить версию Anchor
anchor --version

# Проверить версию Rust
rustc --version
```

#### **Настройка кошелька:**
```bash
# Создать новый кошелек (если нужно)
solana-keygen new --outfile ~/.config/solana/id.json

# Установить кошелек по умолчанию
solana config set --keypair ~/.config/solana/id.json

# Установить devnet
solana config set --url https://api.devnet.solana.com

# Проверить баланс
solana balance
```

### **2. СБОРКА ПРОГРАММЫ:**

#### **Вариант 1: Через Anchor (рекомендуется):**
```bash
# Сборка программы
anchor build

# Если ошибка с +solana, попробуйте:
rustup toolchain install solana
rustup default solana
anchor build
```

#### **Вариант 2: Через Cargo (альтернатива):**
```bash
# Перейти в директорию программы
cd programs/asset_tokenization

# Сборка
cargo build-sbf

# Вернуться в корень
cd ../..
```

### **3. ДЕПЛОЙ НА DEVNET:**

#### **Деплой через Anchor:**
```bash
# Деплой на devnet
anchor deploy --provider.cluster devnet

# Проверить деплой
anchor idl init --provider.cluster devnet
```

#### **Деплой через Solana CLI:**
```bash
# Деплой программы
solana program deploy target/deploy/asset_tokenization.so

# Получить Program ID
solana program show <PROGRAM_ID>
```

### **4. ПРОВЕРКА ДЕПЛОЯ:**

#### **Проверить программу:**
```bash
# Информация о программе
solana program show <PROGRAM_ID>

# Проверить аккаунты программы
solana account <PROGRAM_ID>
```

#### **Тестирование PDA:**
```bash
# Запустить тест PDA
node scripts/get-addresses.js

# Проверить генерацию адресов
node test-program.js
```

### **5. СОЗДАНИЕ IDL:**

#### **Генерация IDL:**
```bash
# Создать IDL файл
anchor idl init --provider.cluster devnet

# Или скопировать готовый
cp target/idl/asset_tokenization.json ./idl.json
```

### **6. ТЕСТИРОВАНИЕ НА DEVNET:**

#### **Запуск тестов:**
```bash
# Запустить все тесты
anchor test --provider.cluster devnet

# Или отдельные тесты
npm test
```

#### **Проверка транзакций:**
```bash
# Посмотреть последние транзакции
solana transaction-history <WALLET_ADDRESS>

# Проверить конкретную транзакцию
solana confirm <TX_SIGNATURE>
```

### **7. ОБНОВЛЕНИЕ ПРОГРАММЫ:**

#### **Обновление деплоя:**
```bash
# Собрать новую версию
anchor build

# Обновить программу
anchor upgrade --provider.cluster devnet

# Или через Solana CLI
solana program deploy target/deploy/asset_tokenization.so --program-id <PROGRAM_ID>
```

### **8. МОНИТОРИНГ И ЛОГИ:**

#### **Просмотр логов:**
```bash
# Логи программы
solana logs <PROGRAM_ID>

# Логи с фильтром
solana logs <PROGRAM_ID> | grep "create_asset"
```

#### **Мониторинг аккаунтов:**
```bash
# Мониторинг изменений аккаунта
solana account <ACCOUNT_ADDRESS> --watch
```

### **9. ПРОБЛЕМЫ И РЕШЕНИЯ:**

#### **Ошибка "+solana toolchain":**
```bash
# Установить solana toolchain
rustup toolchain install solana
rustup default solana
```

#### **Ошибка "Program not found":**
```bash
# Проверить Program ID
solana program show <PROGRAM_ID>

# Пересоздать программу
anchor deploy --provider.cluster devnet
```

#### **Ошибка "Insufficient funds":**
```bash
# Запросить airdrop
solana airdrop 2

# Или использовать другой кошелек
solana config set --keypair <PATH_TO_KEYPAIR>
```

### **10. ГОТОВЫЕ КОМАНДЫ:**

#### **Полный деплой:**
```bash
# 1. Настройка
solana config set --url https://api.devnet.solana.com
solana airdrop 2

# 2. Сборка
anchor build

# 3. Деплой
anchor deploy --provider.cluster devnet

# 4. Тестирование
anchor test --provider.cluster devnet
```

## **ИТОГОВЫЙ ЧЕКЛИСТ:**

- [ ] ✅ Программа написана и компилируется
- [ ] ⏳ Программа деплоена на devnet
- [ ] ⏳ IDL файл создан
- [ ] ⏳ PDA адреса проверены
- [ ] ⏳ Все инструкции протестированы
- [ ] ⏳ Документация создана

**После выполнения всех пунктов программа готова для Frontend/Backend разработчиков! 🎉**
