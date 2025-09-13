# Solana Fractional Assets Backend API

A Node.js backend API for managing fractional assets on the Solana blockchain using Anchor and web3.js.

## Features

- Create fractional assets
- Mint fraction tokens
- Buy/sell fraction tokens
- Distribute revenue to token holders
- Revenue simulation for testing
- Comprehensive logging
- Rate limiting and security

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Solana CLI (for development)
- Anchor framework (for smart contracts)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file with your Solana settings:
```
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_private_key_here
ANCHOR_PROGRAM_ID=your_anchor_program_id_here
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Assets
- `POST /api/assets/create_asset` - Create a new fractional asset
- `POST /api/assets/mint_fraction` - Mint fraction tokens
- `GET /api/assets/asset/:assetMint` - Get asset information

### Transactions
- `POST /api/transactions/buy_fraction` - Buy fraction tokens
- `POST /api/transactions/distribute_revenue` - Distribute revenue to holders
- `GET /api/transactions/history/:address` - Get transaction history
- `GET /api/transactions/balance/:address` - Get wallet balance

### Simulation
- `POST /api/simulation/simulate_revenue` - Simulate revenue distribution
- `GET /api/simulation/simulation_history` - Get simulation history
- `POST /api/simulation/generate_random_revenue` - Generate random revenue for testing

## API Examples

### Create Asset
```bash
curl -X POST http://localhost:3000/api/assets/create_asset \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real Estate Token",
    "symbol": "RET",
    "totalSupply": 1000000,
    "pricePerToken": 0.01,
    "description": "Fractional ownership of a commercial property"
  }'
```

### Mint Fraction Tokens
```bash
curl -X POST http://localhost:3000/api/assets/mint_fraction \
  -H "Content-Type: application/json" \
  -d '{
    "assetMint": "your_asset_mint_address",
    "amount": 1000,
    "recipient": "recipient_wallet_address"
  }'
```

### Buy Fraction Tokens
```bash
curl -X POST http://localhost:3000/api/transactions/buy_fraction \
  -H "Content-Type: application/json" \
  -d '{
    "assetMint": "your_asset_mint_address",
    "amount": 100,
    "buyer": "buyer_wallet_address",
    "pricePerToken": 0.01
  }'
```

### Distribute Revenue
```bash
curl -X POST http://localhost:3000/api/transactions/distribute_revenue \
  -H "Content-Type: application/json" \
  -d '{
    "assetMint": "your_asset_mint_address",
    "totalRevenue": 1000,
    "distributionMethod": "proportional"
  }'
```

### Simulate Revenue
```bash
curl -X POST http://localhost:3000/api/simulation/simulate_revenue \
  -H "Content-Type: application/json" \
  -d '{
    "assetMint": "your_asset_mint_address",
    "revenueAmount": 500,
    "distributionMethod": "proportional"
  }'
```

## Testing with Postman

1. Import the following collection into Postman:

```json
{
  "info": {
    "name": "Solana Fractional Assets API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Create Asset",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Asset\",\n  \"symbol\": \"TEST\",\n  \"totalSupply\": 1000000,\n  \"pricePerToken\": 0.01,\n  \"description\": \"Test fractional asset\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/assets/create_asset",
          "host": ["{{base_url}}"],
          "path": ["api", "assets", "create_asset"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    }
  ]
}
```

2. Set the `base_url` variable to `http://localhost:3000`
3. Run the requests to test the API

## Logging

The application uses Winston for logging. Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels can be configured via the `LOG_LEVEL` environment variable.

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration
- Input validation
- Error handling

## Development Notes

- The current implementation uses mock transactions for demonstration
- To connect to real Solana transactions, update the service methods in `src/services/solanaService.js`
- Ensure your Anchor program is deployed and the program ID is correctly configured
- Use devnet for testing, mainnet for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
