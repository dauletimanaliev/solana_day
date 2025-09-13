# Asset Tokenization Platform

A modern React-based frontend application for asset tokenization on the Solana blockchain. This platform allows users to create, view, and trade fractional ownership of real-world assets.

## Features

- 🏗️ **Asset Creation** - Create tokenized assets with metadata and total supply
- 📊 **Asset Management** - View all available assets in a beautiful grid layout
- 💰 **Fractional Trading** - Buy and sell fractions of existing assets
- 🔗 **Wallet Integration** - Seamless integration with Phantom wallet
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🌐 **Russian Localization** - Full Russian language support

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Blockchain**: Solana (Devnet) with Phantom wallet integration
- **Styling**: Modern CSS with gradients and animations
- **Build Tool**: Vite for fast development and building
- **State Management**: React hooks (useState, useEffect)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Phantom wallet browser extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── AssetsList.jsx          # Asset listing component
│   ├── BuyFractionsForm.jsx    # Fraction purchasing component
│   └── CreateAssetForm.jsx     # Asset creation component
├── config/
│   └── config.js               # Configuration and constants
├── utils/
│   └── utils.js                # Utility functions
├── App.jsx                     # Main application component
├── App.css                     # Main application styles
├── index.css                   # Global styles
└── main.jsx                    # Application entry point
```

## Configuration

The application is configured to work with:
- **Solana Network**: Devnet
- **Program ID**: `FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ`
- **RPC URL**: `https://api.devnet.solana.com`
- **Backend API**: `http://localhost:3001/api`

## Usage

1. **Connect Wallet**: Click the wallet button to connect your Phantom wallet
2. **Create Asset**: Fill out the form to create a new tokenized asset
3. **View Assets**: Browse all available assets in the grid layout
4. **Buy Fractions**: Purchase fractional ownership of existing assets

## Features in Detail

### Asset Creation
- Generate unique Asset IDs (1-999,999)
- Set metadata URI for asset information
- Define total supply (1 to 1 billion tokens)
- Real-time validation and error handling

### Asset Management
- Beautiful card-based layout
- Detailed asset information display
- Metadata links for additional information
- Real-time updates when new assets are created

### Fractional Trading
- Purchase fractions of existing assets
- Input validation for purchase amounts
- Integration with wallet for transaction signing

## Styling

The application features a modern, gradient-based design with:
- Responsive grid layouts
- Smooth animations and transitions
- Card-based component design
- Mobile-first responsive design
- Custom wallet adapter styling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
