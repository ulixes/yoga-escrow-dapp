import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useTransactionCount } from '../hooks/useEscrow';
import CreateClass from './CreateClass';
import TransactionList from './TransactionList';

export default function YogaEscrow() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState<'create' | 'transactions'>('create');
  const { count } = useTransactionCount();

  return (
    <div className="yoga-escrow">
      <div className="user-info">
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()} className="disconnect-button">
          Disconnect
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Yoga Class
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions ({count})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'create' ? (
          <CreateClass />
        ) : (
          <TransactionList />
        )}
      </div>
    </div>
  );
}