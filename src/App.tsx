import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import YogaEscrow from './components/YogaEscrow';
import ConnectWallet from './components/ConnectWallet';
import { useAccount } from 'wagmi';
import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧘 Yoga Class Escrow</h1>
        <p>Secure payments for yoga classes using Kleros Escrow</p>
      </header>
      
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <YogaEscrow />
      )}
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
