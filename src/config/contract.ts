export const ESCROW_CONTRACT = {
  address: '0x79530E7Bb3950A3a4b5a167816154715681F2f6c' as const,
  abi: [
    {
      "inputs": [
        {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
        {"internalType": "string", "name": "_transactionUri", "type": "string"},
        {"internalType": "address payable", "name": "_seller", "type": "address"}
      ],
      "name": "createNativeTransaction",
      "outputs": [{"internalType": "uint256", "name": "transactionID", "type": "uint256"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_transactionID", "type": "uint256"},
        {"internalType": "uint256", "name": "_amount", "type": "uint256"}
      ],
      "name": "pay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_transactionID", "type": "uint256"}
      ],
      "name": "executeTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_transactionID", "type": "uint256"},
        {"internalType": "uint256", "name": "_amountReimbursed", "type": "uint256"}
      ],
      "name": "reimburse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransactionCount",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "transactions",
      "outputs": [
        {"internalType": "address payable", "name": "buyer", "type": "address"},
        {"internalType": "address payable", "name": "seller", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "uint256", "name": "settlementBuyer", "type": "uint256"},
        {"internalType": "uint256", "name": "settlementSeller", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "uint256", "name": "disputeID", "type": "uint256"},
        {"internalType": "uint256", "name": "buyerFee", "type": "uint256"},
        {"internalType": "uint256", "name": "sellerFee", "type": "uint256"},
        {"internalType": "uint256", "name": "lastFeePaymentTime", "type": "uint256"},
        {"internalType": "enum Status", "name": "status", "type": "uint8"},
        {"internalType": "contract IERC20", "name": "token", "type": "address"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const;