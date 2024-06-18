import { useAccount, useConnect, useDisconnect, WalletType } from 'graz';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export const ConnectKeplr = () => {
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  function handleConnect() {
    return isConnected
      ? disconnect()
      : connect({ chainId: 'grand-1', walletType: WalletType.KEPLR });
  }
  return (
    <Button className="w-2/4" onClick={handleConnect}>
      <Wallet size={16} strokeWidth={1.25} />
      {isConnected ? 'Disconnect Keplr' : 'Connect Keplr'}
    </Button>
  );
};
