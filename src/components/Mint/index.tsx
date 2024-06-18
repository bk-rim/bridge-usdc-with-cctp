import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConnectMetamask } from '../ConnectMetamask';
import { useEffect, useState } from 'react';
import abiMsgTransmitter from '../../abi/messageTransmitter.json';
import abiUsdc from '../../abi/erc20.json';
import Web3 from 'web3';
import { TxHashDialog } from './txHashDialog';

type MintFormProps = {
  attestation: string;
  messageHash: string;
};

export function MintForm({ attestation, messageHash }: MintFormProps) {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<any>();
  const [burnTxHash, setBurnTxHash] = useState<string>(messageHash);
  const [attestationHash, setAttestationHash] = useState<string>(attestation);
  const [open, setOpen] = useState<boolean>(false);
  const [mintTxHash, setMintTxHash] = useState<string>('');
  const web3 = new Web3(window.ethereum);

  const msgTransmitterContract = new web3.eth.Contract(
    abiMsgTransmitter,
    '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
  );
  const usdcContract = new web3.eth.Contract(
    abiUsdc,
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
  );

  const getBalance = async (address: string) => {
    const balance = await usdcContract.methods.balanceOf(address).call();
    const balanceEth = web3.utils.fromWei(Number(balance), 'mwei');
    setBalance(balanceEth);
  };

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
    if (attestation) {
      setAttestationHash(attestation);
    }
    if (messageHash) {
      setBurnTxHash(messageHash);
    }
  }, [address, balance, attestation, messageHash]);

  const mint = async () => {
    setOpen(true);
    msgTransmitterContract.methods
      .receiveMessage(burnTxHash, attestationHash)
      .send({ from: address })
      .then((tx: any) => {
        setMintTxHash(tx.transactionHash);
        if (tx.status) {
          getBalance(address);
          setAttestationHash('');
          setBurnTxHash('');
        }
      })
      .catch((e: any) => {
        setOpen(false);
        console.log('error', e.message);
      });
  };

  const resetForm = () => {
    setAttestationHash('');
    setBurnTxHash('');
    setMintTxHash('');
  };

  const isDisabled = !!!address || !!!burnTxHash || !!!attestationHash;

  return (
    <div className="flex flex-col">
      <div>
        <TxHashDialog
          open={open}
          setOpen={setOpen}
          txHash={mintTxHash}
          resetForm={resetForm}
        />
      </div>
      <div className="w-[350px] flex flex-col">
        <div>
          <ConnectMetamask onSuccess={setAddress} />
        </div>
        <div className="flex justify-between p-1">
          <span className="text-sm text-gray-500">
            {address ? address.slice(0, 12) + '...' : ''}
          </span>
          <span className="text-sm text-gray-500">
            {balance ? balance + ' usdc' : ''}
          </span>
        </div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardDescription className="text-center">
              2. Mint USDC on Ethereum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-8">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="txHash"
                    placeholder="burn msg hash"
                    value={burnTxHash}
                    onChange={(e) => setBurnTxHash(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="attestationHash"
                    placeholder="attestation hash - status"
                    value={attestationHash}
                    onChange={(e) => setAttestationHash(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between mt-28">
            <Button className="w-full" onClick={mint} disabled={isDisabled}>
              Mint
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
