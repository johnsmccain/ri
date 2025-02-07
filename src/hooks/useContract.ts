import {  useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ABI, TOKEN_ABI } from '../abi';
import { parseEther } from 'viem';


export function useUserInfo() {
  const { address } = useAccount();
  
  const { data: userInfo }  = useReadContract({
    address: CONTRACT_ABI.address as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'getUserDetail',
    args: [address],
    // enabled: !!address,
  }) as any;
  const { data: userTopUpWallet } = useReadContract({
    address: CONTRACT_ABI.address as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'userTopUpWallet',
    args: [userInfo?.id],
  });

  return {userInfo, userTopUpWallet};
}

export function useRoyaltyPool() {
  const { data: royaltyPool } = useReadContract({
    address: CONTRACT_ABI.address as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'royaltyPool',
  });

  const { data: totalRoyaltyPool } = useReadContract({
    address: CONTRACT_ABI.address as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'totalRoyaltyPool',
  });

  return { royaltyPool, totalRoyaltyPool };
}



export function useInvestment() {
  const { address } = useAccount();
  const {writeContract, data: txHash} = useWriteContract()
  const { isFetched: waitForTransactionReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const {writeContract: approveContract, data: txHashApprove} = useWriteContract()
  const { isFetched: waitForApprovalTransactionReceipt } = useWaitForTransactionReceipt({
    hash: txHashApprove,
  })


  const approve = async (amount: string) => {
    if (!address) return;
    
    try {
      await approveContract({
        abi: TOKEN_ABI.abi,
        address: TOKEN_ABI.address as `0x${string}`,
        functionName: 'approve',
        args: [CONTRACT_ABI.address as `0x${string}`, parseEther(amount)],
      })

    } catch (error) {
      console.error('Investment failed:', error);
    }
  };
  const invest = async (amount: string, useTopUpWallet: boolean = false) => {
    if (!address) return;
    // Get referral from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get('referral');
    const refId = referral ? BigInt(referral) : 1000n; // Default referral code is 1001

    try {
      await writeContract({
        abi: CONTRACT_ABI.abi,
        address: CONTRACT_ABI.address as `0x${string}`,
        functionName: 'buy',
        args: [address, refId, parseEther(amount), useTopUpWallet],
      })

    } catch (error) {
      console.error('Investment failed:', error);
    }
  };


  return { invest, waitForTransactionReceipt, waitForApprovalTransactionReceipt, approve };
}