import { http, createConfig } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const projectId = '296924cdb9a40ac2bfe6b78e60779e09';

const { wallets } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId,
  chains: [ bscTestnet],
});

export const config = createConfig({
  chains: [ bscTestnet],
  transports: {
    [bscTestnet.id]: http(),
  },
  wallets,
});