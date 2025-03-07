import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { opBNB } from 'viem/chains';
import { binanceWallet, metaMaskWallet, rainbowWallet, trustWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [rainbowWallet, walletConnectWallet, trustWallet, metaMaskWallet, binanceWallet],
  },
],
{
  appName: 'G-Rich',
  projectId: '296924cdb9a40ac2bfe6b78e60779e09',
})
export const config = createConfig({
  connectors,
  chains: [opBNB],
  transports: {
    [opBNB.id]: http(),
  },
});