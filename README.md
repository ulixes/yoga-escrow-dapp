# 🧘 Yoga Class Escrow dApp

A simple proof-of-concept decentralized application for secure yoga class payments using the Kleros Escrow v2 contract on Arbitrum One.

## Features

- **Secure Payments**: Students pay for yoga classes through escrow
- **Instructor Protection**: Instructors receive payment after providing the service
- **Dispute Resolution**: Built-in Kleros arbitration for disputes
- **Simple Interface**: Easy-to-use web interface for both instructors and students

## How It Works

### For Yoga Instructors:
1. Connect your wallet (MetaMask recommended)
2. Create a new yoga class escrow
3. Set class details (name, description, price, deadline)
4. Share the transaction ID with potential students
5. After the class, students can pay you through the escrow

### For Students:
1. Connect your wallet
2. Browse available transactions
3. Pay for classes you've attended
4. If there's a dispute, it can be resolved through Kleros arbitration

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

## Contract Details

- **Network**: Arbitrum One
- **Contract Address**: `0x79530E7Bb3950A3a4b5a167816154715681F2f6c`
- **Contract Type**: EscrowUniversal (Kleros Escrow v2)

## Use Case Example

1. **Sarah** is a yoga instructor who wants to offer a private yoga session
2. She creates an escrow transaction for 0.01 ETH with a 7-day deadline
3. **John** wants to take the class and sees the transaction
4. After attending Sarah's yoga class, John pays Sarah through the escrow
5. Sarah receives the payment securely

## Development

Built with:
- React + TypeScript
- Vite
- Wagmi v2 for Web3 integration
- Custom CSS for styling

## Deployment

To deploy this dApp:

1. Update the WalletConnect project ID in `src/config/wagmi.ts`
2. Build the project: `bun run build`
3. Deploy the `dist` folder to your hosting provider

## Security Notes

- This is a proof-of-concept for educational purposes
- Always verify contract addresses before transacting
- Test with small amounts first
- The Kleros Escrow contract is audited and battle-tested

## License

MIT
