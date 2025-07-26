import { useState } from 'react';
import { useTransaction, useEscrow } from '../hooks/useEscrow';

interface TransactionCardProps {
  transactionId: number;
  currentUserAddress: string;
}

const STATUS_NAMES = {
  0: 'No Dispute',
  1: 'Waiting Settlement Buyer',
  2: 'Waiting Settlement Seller',
  3: 'Waiting Buyer',
  4: 'Waiting Seller',
  5: 'Dispute Created',
  6: 'Transaction Resolved'
};

export default function TransactionCard({ transactionId, currentUserAddress }: TransactionCardProps) {
  const { transaction, isLoading, formattedAmount, isExpired } = useTransaction(transactionId);
  const { payInstructor, executeTransaction, reimburse, isPending, isConfirming, isConfirmed } = useEscrow();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  if (isLoading) {
    return <div className="transaction-card loading">Loading transaction...</div>;
  }

  if (!transaction) {
    return <div className="transaction-card error">Transaction not found</div>;
  }

  const isBuyer = transaction.buyer.toLowerCase() === currentUserAddress.toLowerCase();
  const isSeller = transaction.seller.toLowerCase() === currentUserAddress.toLowerCase();
  const isResolved = transaction.status === 6;
  const canPayInstructor = isBuyer && transaction.status === 0 && !isResolved;
  const canExecute = transaction.status === 0 && isExpired && !isResolved;
  const canRequestRefund = isBuyer && transaction.status === 0 && !isExpired && !isResolved;
  const canGiveRefund = isSeller && transaction.status === 0 && !isResolved;

  const handlePay = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    
    if (parseFloat(paymentAmount) > parseFloat(formattedAmount)) {
      alert('Payment amount cannot exceed escrow amount');
      return;
    }

    try {
      await payInstructor(transactionId, paymentAmount);
    } catch (error) {
      console.error('Error paying instructor:', error);
    }
  };

  const handleExecute = async () => {
    try {
      await executeTransaction(transactionId);
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  };

  const handleRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      alert('Please enter a valid refund amount');
      return;
    }
    
    if (parseFloat(refundAmount) > parseFloat(formattedAmount)) {
      alert('Refund amount cannot exceed escrow amount');
      return;
    }

    try {
      await reimburse(transactionId, refundAmount);
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  // Try to parse transaction details from the URI if it's JSON
  let classDetails = null;
  try {
    // In a real app, you'd fetch this from IPFS or another storage
    // For now, we'll assume it might be JSON string
    classDetails = {
      className: `Yoga Class #${transactionId}`,
      description: 'Yoga class details',
      location: 'TBD',
      time: 'TBD'
    };
  } catch (e) {
    // Ignore parsing errors
  }

  return (
    <div className={`transaction-card ${isResolved ? 'resolved' : ''} ${isBuyer ? 'buyer' : ''} ${isSeller ? 'seller' : ''}`}>
      <div className="transaction-header">
        <h3>
          {classDetails?.className || `Transaction #${transactionId}`}
          {isResolved && <span className="resolved-badge">✅ Resolved</span>}
        </h3>
        <div className="transaction-amount">{formattedAmount} ETH</div>
      </div>

      <div className="transaction-details">
        <div className="detail-row">
          <span>Status:</span>
          <span className="status" data-status={transaction.status}>
            {STATUS_NAMES[transaction.status as keyof typeof STATUS_NAMES] || 'Unknown'}
          </span>
        </div>
        
        <div className="detail-row">
          <span>Instructor:</span>
          <span className="address">{transaction.seller}</span>
          {isSeller && <span className="you-badge">You</span>}
        </div>
        
        <div className="detail-row">
          <span>Student:</span>
          <span className="address">{transaction.buyer}</span>
          {isBuyer && <span className="you-badge">You</span>}
        </div>

        <div className="detail-row">
          <span>Deadline:</span>
          <span className={isExpired ? 'expired' : ''}>
            {new Date(Number(transaction.deadline) * 1000).toLocaleString()}
            {isExpired && ' (Expired)'}
          </span>
        </div>

        {classDetails && (
          <>
            {classDetails.description && (
              <div className="detail-row">
                <span>Description:</span>
                <span>{classDetails.description}</span>
              </div>
            )}
            {classDetails.location && (
              <div className="detail-row">
                <span>Location:</span>
                <span>{classDetails.location}</span>
              </div>
            )}
            {classDetails.time && (
              <div className="detail-row">
                <span>Time:</span>
                <span>{classDetails.time}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="transaction-actions">
        {canPayInstructor && (
          <div className="payment-section">
            <h4>Pay Instructor</h4>
            <div className="payment-input">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Amount in ETH"
                step="0.001"
                min="0"
                max={formattedAmount}
              />
              <button
                onClick={handlePay}
                disabled={isPending || isConfirming}
                className="pay-button"
              >
                {isPending || isConfirming ? 'Processing...' : 'Pay'}
              </button>
            </div>
            <p className="payment-note">
              Pay the instructor after attending the class. You can pay the full amount or partial.
            </p>
          </div>
        )}

        {canExecute && (
          <div className="execute-section">
            <h4>Execute Transaction</h4>
            <p>The deadline has passed. Execute to release funds to instructor.</p>
            <button
              onClick={handleExecute}
              disabled={isPending || isConfirming}
              className="execute-button"
            >
              {isPending || isConfirming ? 'Processing...' : 'Execute Transaction'}
            </button>
          </div>
        )}

        {canRequestRefund && (
          <div className="refund-section">
            <h4>💸 Request Refund</h4>
            <p>Class hasn't started yet. Contact the instructor to request a refund.</p>
            <div className="refund-note">
              <p><strong>Note:</strong> Only the instructor can process refunds. You can message them at:</p>
              <p style={{fontFamily: 'monospace', fontSize: '0.9rem', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px'}}>
                {transaction.seller}
              </p>
            </div>
          </div>
        )}

        {canGiveRefund && (
          <div className="refund-section">
            <h4>💰 Give Refund to Student</h4>
            <p>Refund the student before the class deadline.</p>
            <div className="payment-input">
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Amount to refund (ETH)"
                step="0.001"
                min="0"
                max={formattedAmount}
              />
              <button
                onClick={handleRefund}
                disabled={isPending || isConfirming}
                className="refund-button"
              >
                {isPending || isConfirming ? 'Processing...' : 'Process Refund'}
              </button>
            </div>
            <p className="payment-note">
              This will send the refund directly to the student's wallet.
            </p>
          </div>
        )}

        {!isBuyer && !isSeller && (
          <div className="observer-note">
            <p>You are viewing this transaction as an observer.</p>
          </div>
        )}

        {isResolved && (
          <div className="resolved-note">
            <p>✅ This transaction has been resolved.</p>
          </div>
        )}
      </div>

      {isConfirmed && (
        <div className="success-message">
          <p>✅ Transaction processed successfully!</p>
        </div>
      )}
    </div>
  );
}