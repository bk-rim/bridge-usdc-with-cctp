import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';

type Props = {
  onSuccess: (account: string) => void;
};
export const ConnectMetamask = ({ onSuccess }: Props) => {
  function isConnected() {
    return window.ethereum && window.ethereum.isConnected();
  }

  const SwitchNetwork = async () => {
    if (!window.ethereum) {
      alert('Please install Metamask');
      return;
    }
    await window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xAA36A7' }],
      })
      .then(() =>
        console.log('Successfully! Connected to the requested Network')
      )
      .catch(async (err) => {
        if (err.message.startsWith('Unrecognized chain ID')) {
          if (window.ethereum) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xAA36A7',
                  rpcUrls: ['https://rpc.sepolia.org/'],
                  chainName: 'Ethereum Sepolia',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SepoliaETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                },
              ],
            });
          }
        }
      });
  };

  async function checkNetwork() {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      if (currentChainId !== '0xAA36A7') {
        SwitchNetwork();
      }
    }
  }

  useEffect(() => {
    if (isConnected() && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: any) => {
        onSuccess(accounts[0]);
      });
    }
  }, []);

  async function connectToWallet() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: any) => {
          onSuccess(accounts[0]);
          checkNetwork();
        })
        .catch((e) => {
          console.log('metamask-error', e);
        });
    } else {
      alert('Please install Metamask');
    }
  }

  return (
    <Button className="w-2/4" onClick={connectToWallet}>
      <Wallet size={16} strokeWidth={1.25} /> Connect Metamask
    </Button>
  );
};
