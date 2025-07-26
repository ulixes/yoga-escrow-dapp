import { useAccount } from 'wagmi';
import { useTransactionCount } from '../hooks/useEscrow';
import TransactionCard from './TransactionCard';

export default function TransactionList() {
  const { address } = useAccount();
  const { count, isLoading } = useTransactionCount();

  if (isLoading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (count === 0) {
    return (
      <div className="no-transactions">
        <h3>No Transactions Yet</h3>
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