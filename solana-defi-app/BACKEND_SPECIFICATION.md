# 🏗️ BACKEND SPECIFICATION - Asset Tokenization

## 📋 Обзор проекта

Бэкенд для платформы токенизации активов на Solana. Обеспечивает API для взаимодействия с смарт-контрактом, управление данными и real-time обновления.

## 🎯 Основные функции

### 1. **Интеграция с Solana**
- Подключение к Solana RPC (Devnet/Mainnet)
- Взаимодействие с смарт-контрактом `asset_tokenization`
- Мониторинг транзакций в реальном времени
- Валидация и подписание транзакций

### 2. **Управление активами**
- CRUD операции для активов
- Синхронизация с блокчейном
- Кэширование данных
- Валидация метаданных

### 3. **Пользовательская система**
- Аутентификация через Solana кошелек
- Управление профилями
- История транзакций
- Права доступа

## 🛠️ Технологический стек

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "language": "TypeScript",
  "database": "PostgreSQL",
  "orm": "Prisma",
  "cache": "Redis",
  "websocket": "Socket.io",
  "auth": "JWT + Solana signatures",
  "fileStorage": "IPFS + Local storage",
  "blockchain": "Solana Web3.js",
  "deployment": "Docker + PM2"
}
```

## 📊 Схема базы данных

### Таблица `assets`
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solana_asset_id VARCHAR(44) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_supply BIGINT NOT NULL,
  remaining_supply BIGINT NOT NULL,
  price_per_token BIGINT NOT NULL,
  metadata_uri TEXT,
  image_uri TEXT,
  creator_wallet VARCHAR(44) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Таблица `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id),
  user_wallet VARCHAR(44) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'create', 'mint', 'buy', 'revenue'
  amount BIGINT,
  price BIGINT,
  solana_tx_hash VARCHAR(88) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Таблица `token_holders`
```sql
CREATE TABLE token_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id),
  wallet_address VARCHAR(44) NOT NULL,
  token_amount BIGINT NOT NULL,
  percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(asset_id, wallet_address)
);
```

### Таблица `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(44) UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(255),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Аутентификация
```typescript
// POST /api/auth/connect
interface ConnectWalletRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

interface ConnectWalletResponse {
  token: string;
  user: User;
}
```

### Активы
```typescript
// GET /api/assets
interface GetAssetsResponse {
  assets: Asset[];
  total: number;
  page: number;
  limit: number;
}

// POST /api/assets
interface CreateAssetRequest {
  name: string;
  description: string;
  totalSupply: number;
  pricePerToken: number;
  imageFile?: File;
  metadataUri?: string;
}

interface CreateAssetResponse {
  asset: Asset;
  transaction: Transaction;
}

// GET /api/assets/:id
interface GetAssetResponse {
  asset: Asset;
  holders: TokenHolder[];
  transactions: Transaction[];
}

// POST /api/assets/:id/mint
interface MintTokensRequest {
  amount: number;
}

// POST /api/assets/:id/revenue
interface DistributeRevenueRequest {
  amount: number;
}
```

### Пользователи
```typescript
// GET /api/user/profile
interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  profileImage?: string;
  assets: Asset[];
  transactions: Transaction[];
}

// PUT /api/user/profile
interface UpdateProfileRequest {
  username?: string;
  email?: string;
  profileImage?: File;
}
```

## 🔧 Конфигурация

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/asset_tokenization"
REDIS_URL="redis://localhost:6379"

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_WS_URL="wss://api.devnet.solana.com"
PROGRAM_ID="B2TxoGmeitsiqPXt5vZFe1neCtPfs9xqx2GhHrd8GV3S"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# IPFS
IPFS_URL="https://ipfs.infura.io:5001"
IPFS_PROJECT_ID="your-project-id"
IPFS_PROJECT_SECRET="your-project-secret"

# Server
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Asset {
  id              String   @id @default(uuid())
  solanaAssetId   String   @unique @map("solana_asset_id")
  name            String
  description     String?
  totalSupply     BigInt   @map("total_supply")
  remainingSupply BigInt   @map("remaining_supply")
  pricePerToken   BigInt   @map("price_per_token")
  metadataUri     String?  @map("metadata_uri")
  imageUri        String?  @map("image_uri")
  creatorWallet   String   @map("creator_wallet")
  status          String   @default("active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  transactions    Transaction[]
  tokenHolders    TokenHolder[]

  @@map("assets")
}

model Transaction {
  id            String   @id @default(uuid())
  assetId       String   @map("asset_id")
  userWallet    String   @map("user_wallet")
  type          String
  amount        BigInt?
  price         BigInt?
  solanaTxHash  String?  @unique @map("solana_tx_hash")
  status        String   @default("pending")
  createdAt     DateTime @default(now()) @map("created_at")

  asset         Asset    @relation(fields: [assetId], references: [id])

  @@map("transactions")
}

model TokenHolder {
  id            String   @id @default(uuid())
  assetId       String   @map("asset_id")
  walletAddress String   @map("wallet_address")
  tokenAmount   BigInt   @map("token_amount")
  percentage    Decimal? @db.Decimal(5, 2)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  asset         Asset    @relation(fields: [assetId], references: [id])

  @@unique([assetId, walletAddress])
  @@map("token_holders")
}

model User {
  id            String   @id @default(uuid())
  walletAddress String   @unique @map("wallet_address")
  username      String?
  email         String?
  profileImage  String?  @map("profile_image")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## 🚀 Структура проекта

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── assets.controller.ts
│   │   ├── users.controller.ts
│   │   └── transactions.controller.ts
│   ├── services/
│   │   ├── solana.service.ts
│   │   ├── ipfs.service.ts
│   │   ├── auth.service.ts
│   │   └── assets.service.ts
│   ├── models/
│   │   ├── Asset.ts
│   │   ├── Transaction.ts
│   │   ├── User.ts
│   │   └── TokenHolder.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── assets.routes.ts
│   │   ├── users.routes.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── solana.utils.ts
│   │   ├── validation.utils.ts
│   │   └── response.utils.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── solana.ts
│   │   └── redis.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── assets.types.ts
│   │   └── api.types.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── uploads/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🔐 Аутентификация

### Solana Wallet Authentication
```typescript
// services/auth.service.ts
export class AuthService {
  async verifySignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    const publicKey = new PublicKey(walletAddress);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
  }

  async generateJWT(user: User): Promise<string> {
    return jwt.sign(
      { 
        userId: user.id, 
        walletAddress: user.walletAddress 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}
```

## 🌐 Solana Integration

### Solana Service
```typescript
// services/solana.service.ts
export class SolanaService {
  private connection: Connection;
  private program: Program<Idl>;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!);
    this.program = new Program(idl as Idl, this.connection);
  }

  async createAsset(
    assetData: CreateAssetData,
    creatorKeypair: Keypair
  ): Promise<string> {
    const assetPDA = PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), creatorKeypair.publicKey.toBuffer()],
      this.program.programId
    )[0];

    const mintKeypair = Keypair.generate();
    const revenuePDA = PublicKey.findProgramAddressSync(
      [Buffer.from("revenue_pool"), creatorKeypair.publicKey.toBuffer()],
      this.program.programId
    )[0];

    const tx = await this.program.methods
      .createAsset(assetData.metadataUri, new BN(assetData.totalSupply))
      .accounts({
        asset: assetPDA,
        assetId: creatorKeypair.publicKey,
        creator: creatorKeypair.publicKey,
        mint: mintKeypair.publicKey,
        revenueAccount: revenuePDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([creatorKeypair, mintKeypair])
      .rpc();

    return tx;
  }

  async mintTokens(
    assetId: string,
    amount: number,
    creatorKeypair: Keypair
  ): Promise<string> {
    // Implementation for minting tokens
  }

  async distributeRevenue(
    assetId: string,
    amount: number,
    creatorKeypair: Keypair
  ): Promise<string> {
    // Implementation for revenue distribution
  }
}
```

## 📁 File Upload & IPFS

### IPFS Service
```typescript
// services/ipfs.service.ts
export class IPFSService {
  private client: IPFSHTTPClient;

  constructor() {
    this.client = create({
      url: process.env.IPFS_URL!,
      headers: {
        authorization: `Basic ${Buffer.from(
          `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
        ).toString('base64')}`
      }
    });
  }

  async uploadFile(file: Buffer, filename: string): Promise<string> {
    const result = await this.client.add({
      path: filename,
      content: file
    });
    
    return `https://ipfs.io/ipfs/${result.cid}`;
  }

  async uploadMetadata(metadata: any): Promise<string> {
    const metadataJson = JSON.stringify(metadata, null, 2);
    const result = await this.client.add(metadataJson);
    
    return `https://ipfs.io/ipfs/${result.cid}`;
  }
}
```

## ⚡ WebSocket Events

### Real-time Updates
```typescript
// WebSocket events
interface WebSocketEvents {
  'asset:created': (asset: Asset) => void;
  'asset:updated': (asset: Asset) => void;
  'transaction:confirmed': (transaction: Transaction) => void;
  'transaction:failed': (transaction: Transaction) => void;
  'balance:updated': (wallet: string, balance: number) => void;
}

// Socket.io implementation
io.on('connection', (socket) => {
  socket.on('subscribe:asset', (assetId: string) => {
    socket.join(`asset:${assetId}`);
  });

  socket.on('subscribe:wallet', (walletAddress: string) => {
    socket.join(`wallet:${walletAddress}`);
  });
});
```

## 🐳 Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/asset_tokenization
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=asset_tokenization
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 📝 API Documentation

### Swagger/OpenAPI
```yaml
openapi: 3.0.0
info:
  title: Asset Tokenization API
  version: 1.0.0
  description: API for asset tokenization on Solana

paths:
  /api/assets:
    get:
      summary: Get all assets
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        200:
          description: List of assets
          content:
            application/json:
              schema:
                type: object
                properties:
                  assets:
                    type: array
                    items:
                      $ref: '#/components/schemas/Asset'
                  total:
                    type: integer
                  page:
                    type: integer
                  limit:
                    type: integer

components:
  schemas:
    Asset:
      type: object
      properties:
        id:
          type: string
          format: uuid
        solanaAssetId:
          type: string
        name:
          type: string
        description:
          type: string
        totalSupply:
          type: integer
          format: int64
        remainingSupply:
          type: integer
          format: int64
        pricePerToken:
          type: integer
          format: int64
        metadataUri:
          type: string
        imageUri:
          type: string
        creatorWallet:
          type: string
        status:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Load balancing configured

### Performance Optimization
- Redis caching for frequently accessed data
- Database indexing on critical fields
- CDN for static assets
- Connection pooling for database
- Compression middleware
- Request/response logging

---

**Этот документ содержит полную спецификацию для бэкендера. Все готово для начала разработки!** 🎯
