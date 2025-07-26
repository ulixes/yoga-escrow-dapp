import { createConfig, http } from 'wagmi';
import { base, arbitrum } from 'wagmi/chains';
import { walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors';

const projectId = 'yoga-escrow-app'; // In a real app, use your WalletConnect project ID

export const config = createConfig({
  chains: [base, arbitrum],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: 'Yoga Escrow' }),
  ],
  transports: {
    [base.id]: http(),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});