import { useAccount, useChainId } from 'wagmi';
import { useTransactionCount } from '../hooks/useEscrow';
import TransactionCard from './TransactionCard';

export default function TransactionList() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { count, isLoading, error } = useTransactionCount();

  if (isLoading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (error) {
    return (
      <div className="error-message" style={{
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>⚠️ Contract Connection Issue</h3>
        <p><strong>Network:</strong> {chainId === 42161 ? 'Arbitrum One' : chainId === 8453 ? 'Base Mainnet' : `Chain ID: ${chainId}`}</p>
        <p><strong>Error:</strong> {error.message}</p>
        <p>This usually means:</p>
        <ul>
          <li>The Kleros Escrow contract doesn't exist on this network</li>
          <li>You need to switch to a supported network</li>
          <li>There's a network connectivity issue</li>
        </ul>
        <p><strong>Try:</strong> Switch to {chainId === 42161 ? 'Base Mainnet' : 'Arbitrum One'} in your wallet</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="no-transactions">
        <h3>No Transactions Yet</h3>
        <p><strong>Network:</strong> {chainId === 42161 ? 'Arbitrum One' : chainId === 8453 ? 'Base Mainnet' : `Chain ID: ${chainId}`}</p>
        <p>Create your first yoga class to get started!</p>
      </div>
    );
  }

  // Generate array of transaction IDs from 0 to count-1
  const transactionIds = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="transaction-list">
      <h2>All Class Bookings ({count})</h2>
      <p className="help-text">
        Here you can see all yoga class bookings. As a student, you can request refunds before class starts. As an instructor, you can process refunds.
      </p>
      
      <div className="transactions">
        {transactionIds.map(id => (
          <TransactionCard 
            key={id} 
            transactionId={id} 
            currentUserAddress={address || ''} 
          />
        ))}
      </div>
    </div>
  );
}