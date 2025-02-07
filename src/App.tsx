import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Copy, Menu, Wallet } from 'lucide-react';
import { useUserInfo, useRoyaltyPool, useInvestment } from './hooks/useContract';
import { formatEther } from 'viem';
function App() {
  const { isConnected } = useAccount();

  const [investAmount, setInvestAmount] = useState<string>('');
  const [useTopUpWallet, setUseTopUpWallet] = useState(false);
  const [Temp, setTemp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userInfo, userTopUpWallet } = useUserInfo();
  const { royaltyPool, totalRoyaltyPool } = useRoyaltyPool();
  const { invest, approve, waitForTransactionReceipt, waitForApprovalTransactionReceipt } = useInvestment();

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://grich.cloud?referral=${userInfo?.id || '0'}`);
  };

  const handleInvest = () => {
    if(useTopUpWallet){
      invest(investAmount, true);
    } else {      
      approve(investAmount);
    }
    setLoading(true);
    setTemp(true);
  };

  // console.log(userTopUpWallet)
  useEffect(() => {
    if (!isAccountActivated && waitForApprovalTransactionReceipt && Temp) {
      // For initial activation, always use 6 dollars
      invest('6', false);
      setTemp(false);

    } else if (investAmount && waitForApprovalTransactionReceipt && Temp) {
      invest(investAmount, useTopUpWallet);
      setTemp(false);
    }
  }, [waitForApprovalTransactionReceipt]);

  useEffect(() => {
    if (waitForTransactionReceipt && loading) {
      // For initial activation, always use 6 dollars
      setLoading(false);
    }
  }, [waitForTransactionReceipt]);
  // console.log(waitForTransactionReceipt)
  const formatUSD = (value: bigint | undefined) => {
    if (!value) return '$0';
    return `$${parseFloat(formatEther(value)).toFixed(2)}`;
  };
  // Check if the account is activated (has made the initial $6 investment)
  const isAccountActivated = userInfo?.totalDepositUSDT && userInfo.totalDepositUSDT > 0n;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-yellow-900">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white"><span className="text-yellow-400">G</span>Rich</span>
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton />
            <Menu className="text-white w-6 h-6 cursor-pointer" />
          </div>
        </header>

        {isConnected ? (
          <div className="space-y-8">
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Make Your Mark</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-2">
                      {isAccountActivated ? 'Invest' : '6$'}
                    </div>
                    <div className="text-gray-600">
                      {isAccountActivated ? 'Enter Amount' : 'Activate Your Account'}
                    </div>
                  </div>
                  {isAccountActivated ? (
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        placeholder="Enter Amount to Invest"
                        className="w-full p-2 border rounded-lg text-center"
                        min="1"
                      />
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => setUseTopUpWallet(false)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${!useTopUpWallet
                              ? 'bg-yellow-400 text-black'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          Direct
                        </button>
                        <button
                          onClick={() => setUseTopUpWallet(true)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${useTopUpWallet
                              ? 'bg-yellow-400 text-black'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          <Wallet className="w-4 h-4" />
                          Topup
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-600">
                      Initial investment required
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatUSD(userTopUpWallet as bigint)}
                  </div>
                  <div className="text-gray-600">TopUp Wallet</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                  <span>Total Investment</span>
                  <span className="text-yellow-600">
                    {formatUSD(userInfo?.totalDepositUSDT)}
                  </span>
                </div>
                {/* {isAccountActivated as boolean && (
                  <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                    <span>Topup Wallet Balance</span>
                    <span className="text-yellow-600">
                      {formatUSD(userInfo?.userTopUpWallet)}
                    </span>
                  </div>
                )} */}
              </div>
              <button
                onClick={handleInvest}
                disabled={loading || !isAccountActivated || !investAmount}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Processing...</span>
                    {/* Loading spinner animation */}
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isAccountActivated ? (
                  `Approve ${investAmount || '0'}$ USDT${useTopUpWallet ? ' (Using Topup)' : ''}`
                ) : (
                  'Approve 6$ USDT'
                )}
              </button>
            </section>

            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Royalty Claim</h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span>Royalty Pool</span>
                <div className="flex items-center gap-4">
                  <span>
                    {formatUSD(royaltyPool as bigint)} / {formatUSD(totalRoyaltyPool as bigint)}
                  </span>
                  <span className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
                    {userInfo?.royaltyIncomeUSDT && userInfo.royaltyIncomeUSDT > 0n ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Income claim</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Level income claimed</span>
                  <span>{formatUSD(userInfo?.refIncomeUSDT)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Cashback claimed</span>
                  <span>{formatUSD(userInfo?.totalTokensClaimed)}</span>
                </div>
              </div>
            </section>

            {isAccountActivated as boolean && (
              <section className="bg-white rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Referral link</h2>
                <div className="bg-white border rounded-lg p-3 mb-4">
                  <input
                    type="text"
                    readOnly
                    value={`https://grich.cloud?referral=${userInfo?.id || '0'}`}
                    className="w-full text-center text-gray-600"
                  />
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome to GRich</h2>
            <p className="text-gray-300 mb-8">Connect your wallet to get started</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;