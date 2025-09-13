# Asset Tokenization Program

Программа для токенизации активов на блокчейне Solana с использованием Anchor framework.

## 🚀 Функциональность

### Основные инструкции:
- **`create_asset`** - Создание токенизированного актива
- **`mint_fraction_tokens`** - Выпуск фракционных токенов
- **`buy_fractions`** - Покупка фракций пользователями
- **`distribute_revenue`** - Распределение дохода по долям

### Структуры данных:
- **`Asset`** - Информация об активе (ID, создатель, метаданные, общий объем)
- **`Escrow`** - Эскроу для хранения фракционных токенов
- **`RevenuePool`** - Пул для распределения доходов

## 🛠️ Установка и настройка

### Требования:
- Rust 1.79.0+
- Solana CLI 1.18.20+
- Anchor CLI 0.31.1+
- Node.js 16+

### Установка зависимостей:
```bash
# Установка Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Установка Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.20/install)"

# Установка Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Установка зависимостей проекта
npm install
```

### Настройка окружения:
```bash
# Настройка Solana CLI на devnet
solana config set --url devnet

# Создание кошелька (если нужно)
solana-keygen new --outfile ~/.config/solana/id.json

# Получение SOL для тестирования
solana airdrop 2
```

## 🔨 Компиляция и тестирование

### Компиляция программы:
```bash
# Проверка компиляции
cargo check

# Сборка программы (если доступен cargo-build-sbf)
anchor build
```

### Запуск тестов:
```bash
# Запуск тестов
npm test

# Или через Anchor (если настроен toolchain)
anchor test
```

## 📋 Использование программы

### 1. Создание актива:
```typescript
const assetId = new anchor.BN(12345);
const metadataUri = "https://example.com/metadata.json";
const totalSupply = new anchor.BN(1000000);

await program.methods
  .createAsset(assetId, metadataUri, totalSupply)
  .accounts({
    asset: assetPda,
    escrow: escrowPda,
    revenuePool: revenuePoolPda,
    creator: creator.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([creator])
  .rpc();
```

### 2. Выпуск фракционных токенов:
```typescript
const mintAmount = new anchor.BN(100000);

await program.methods
  .mintFractionTokens(mintAmount)
  .accounts({
    asset: assetPda,
    escrow: escrowPda,
  })
  .rpc();
```

### 3. Покупка фракций:
```typescript
const buyAmount = new anchor.BN(50000);

await program.methods
  .buyFractions(buyAmount)
  .accounts({
    asset: assetPda,
    escrow: escrowPda,
    buyer: buyer.publicKey,
  })
  .signers([buyer])
  .rpc();
```

### 4. Распределение дохода:
```typescript
const revenueAmount = new anchor.BN(1000);

await program.methods
  .distributeRevenue(revenueAmount)
  .accounts({
    revenuePool: revenuePoolPda,
    asset: assetPda,
    creator: creator.publicKey,
  })
  .signers([creator])
  .rpc();
```

## 🔍 Проверка транзакций

### Получение информации об активе:
```bash
# Получение данных актива
solana account <ASSET_PDA_ADDRESS> --output json

# Получение данных эскроу
solana account <ESCROW_PDA_ADDRESS> --output json

# Получение данных пула доходов
solana account <REVENUE_POOL_PDA_ADDRESS> --output json
```

### Просмотр логов транзакций:
```bash
# Просмотр логов по подписи транзакции
solana logs <TRANSACTION_SIGNATURE>

# Просмотр логов программы
solana logs --program <PROGRAM_ID>
```

### Проверка баланса кошелька:
```bash
# Проверка баланса SOL
solana balance

# Проверка баланса токенов
spl-token balance <TOKEN_MINT_ADDRESS>
```

## 📊 PDA Адреса

### Получение адресов PDA:
```typescript
// Адрес актива
const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
  program.programId
);

// Адрес эскроу
const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("escrow"), assetPda.toBytes()],
  program.programId
);

// Адрес пула доходов
const [revenuePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("revenue_pool"), assetPda.toBytes()],
  program.programId
);
```

## 🚨 Обработка ошибок

### Типы ошибок:
- **`InsufficientSupply`** - Недостаточно токенов для выпуска
- **`InsufficientTokenBalance`** - Недостаточно токенов в эскроу
- **`InvalidAmount`** - Неверная сумма
- **`Unauthorized`** - Неавторизованный доступ

### Пример обработки ошибок:
```typescript
try {
  await program.methods
    .mintFractionTokens(excessiveAmount)
    .accounts({...})
    .rpc();
} catch (error) {
  if (error.message.includes("InsufficientSupply")) {
    console.log("Недостаточно токенов для выпуска");
  }
}
```

## 🔧 Разработка

### Структура проекта:
```
asset_tokenization/
├── programs/
│   └── asset_tokenization/
│       └── src/
│           └── lib.rs          # Основная программа
├── tests/
│   └── asset_tokenization.ts   # Тесты
├── target/
│   └── idl/
│       └── asset_tokenization.json  # IDL файл
└── Anchor.toml                 # Конфигурация Anchor
```

### Генерация IDL:
```bash
# Генерация IDL файла
anchor build

# IDL файл будет создан в target/idl/asset_tokenization.json
```

## 📝 Примеры использования

### Полный цикл токенизации:
1. Создать актив с метаданными
2. Выпустить фракционные токены в эскроу
3. Пользователи покупают фракции
4. Распределение дохода между держателями

### Интеграция с фронтендом:
```typescript
// Подключение к программе
const program = new Program<AssetTokenization>(idl, programId, provider);

// Получение данных актива
const asset = await program.account.asset.fetch(assetPda);

// Подписка на изменения
program.account.asset.subscribe(assetPda, (account) => {
  console.log("Asset updated:", account);
});
```

## 🚀 Деплой

### Деплой на Devnet:
```bash
# Деплой программы
anchor deploy --provider.cluster devnet

# Проверка деплоя
solana program show <PROGRAM_ID>
```

### Деплой на Mainnet:
```bash
# Настройка на mainnet
solana config set --url mainnet-beta

# Деплой (требует SOL для деплоя)
anchor deploy --provider.cluster mainnet-beta
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи транзакций
2. Убедитесь в правильности PDA адресов
3. Проверьте баланс кошелька
4. Убедитесь в правильности параметров

## 📄 Лицензия

MIT License
