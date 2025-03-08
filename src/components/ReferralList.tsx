import { useAccount } from 'wagmi';
import { useUserInfo } from '../hooks/useContract';
import { formatEther } from 'viem';

const ReferralList = () => {
  const { address } = useAccount();
  const { userInfo } = useUserInfo();

  const formatUSD = (value: bigint | undefined) => {
    if (!value) return '$0';
    return `$${parseFloat(formatEther(value)).toFixed(2)}`;
  };


  if (!address) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-white">Please connect your wallet to view referrals</p>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-0 py-8 pb-0 mt-16">
      <div className="bg-white rounded-xl p-6 mb-0">
        <h2 className="text-2xl font-bold mb-4">Your Referral Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Referrals</p>
            <p className="text-2xl font-bold">{userInfo?.refCount?.toString() || '0'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Team</p>
            <p className="text-2xl font-bold">{userInfo?.totalMatrixTeam?.toString() || '0'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-yellow-600">{formatUSD(userInfo?.refIncomeUSDT)}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReferralList;