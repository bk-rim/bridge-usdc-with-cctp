import { ChainInfo } from '@keplr-wallet/types';
import { GrazProvider } from 'graz';
import { BurnForm } from './components/Burn';
import { MintForm } from './components/Mint';
import { useState } from 'react';

const grand: ChainInfo = {
  chainId: 'grand-1',
  chainName: 'Grand',
  rpc: '',
  rest: '',
  currencies: [],
  feeCurrencies: [],
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'noble',
    bech32PrefixAccPub: 'noblepub',
    bech32PrefixValAddr: 'noblevaloper',
    bech32PrefixValPub: 'noblevaloperpub',
    bech32PrefixConsAddr: 'noblevalcons',
    bech32PrefixConsPub: 'noblevalconspub',
  },
};

function App() {
  const [attestation, setAttestation] = useState<string>('');
  const [messageHash, setMessageHash] = useState<string>('');

  return (
    <GrazProvider
      grazOptions={{
        chains: [grand],
      }}
    >
      <div className="flex flex-col h-screen gap-12">
        <div>
          <h1 className="text-2xl text-center mt-16">
            Bridge USDC from Noble to Ethereum
          </h1>
        </div>
        <div className="flex w-screen justify-evenly mt-16">
          <BurnForm
            shareAttestation={setAttestation}
            shareMessageHash={setMessageHash}
          />
          <MintForm attestation={attestation} messageHash={messageHash} />
        </div>
      </div>
    </GrazProvider>
  );
}
export default App;
