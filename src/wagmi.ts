import { http, createConfig } from 'wagmi';
import { mainnet, bscTestnet } from 'wagmi/chains';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const projectId = '296924cdb9a40ac2bfe6b78e60779e09';

const { wallets } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId,
  chains: [mainnet, bscTestnet],
});

export const config = createConfig({
  chains: [mainnet, bscTestnet],
  transports: {
    [mainnet.id]: http(),
    [bscTestnet.id]: http(),
  },
  wallets,
});