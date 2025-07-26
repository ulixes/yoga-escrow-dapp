import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ESCROW_CONTRACT } from '../config/contract';

export interface Transaction {
  buyer: string;
  seller: string;
  amount: bigint;
  deadline: bigint;
  status: number;
}

export function useEscrow() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createYogaClass = async (
    instructorAddress: string,
    priceInEth: string,
    secondsFromNow: number,
    description: string
  ) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = BigInt(currentTime + secondsFromNow);
    
    console.log('🔍 Debug info:', {
      priceInEth,
      secondsFromNow,
      currentTime,
      deadline: deadline.toString(),
      instructorAddress,
      parsedEther: parseEther(priceInEth).toString()
    });
    
    writeContract({
      address: ESCROW_CONTRACT.address,
      abi: ESCROW_CONTRACT.abi,
      functionName: 'createNativeTransaction',
      args: [deadline, description, instructorAddress as `0x${string}`],
      value: parseEther(priceInEth),
    });
  };

  const payInstructor = async (transactionId: number, amount: string) => {
    writeContract({
      address: ESCROW_CONTRACT.address,
      abi: ESCROW_CONTRACT.abi,
      functionName: 'pay',
      args: [BigInt(transactionId), parseEther(amount)],
    });
  };

  const executeTransaction = async (transactionId: number) => {
    writeContract({
      address: ESCROW_CONTRACT.address,
      abi: ESCROW_CONTRACT.abi,
      functionName: 'executeTransaction',
      args: [BigInt(transactionId)],
    });
  };

  const reimburse = async (transactionId: number, amount: string) => {
    writeContract({
      address: ESCROW_CONTRACT.address,
      abi: ESCROW_CONTRACT.abi,
      functionName: 'reimburse',
      args: [BigInt(transactionId), parseEther(amount)],
    });
  };

  return {
    createYogaClass,
    payInstructor,
    executeTransaction,
    reimburse,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

export function useTransactionCount() {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_CONTRACT.address,
    abi: ESCROW_CONTRACT.abi,
    functionName: 'getTransactionCount',
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

export function useTransaction(transactionId: number) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_CONTRACT.address,
    abi: ESCROW_CONTRACT.abi,
    functionName: 'transactions',
    args: [BigInt(transactionId)],
  });

  const transaction: Transaction | null = data ? {
    buyer: data[0],
    seller: data[1],
    amount: data[2],
    deadline: data[5],
    status: data[10],
  } : null;

  return {
    transaction,
    isLoading,
    error,
    formattedAmount: transaction ? formatEther(transaction.amount) : '0',
    isExpired: transaction ? Date.now() / 1000 > Number(transaction.deadline) : false,
  };
}