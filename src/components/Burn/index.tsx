import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAccount, useOfflineSigners } from 'graz';
import { useEffect, useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { createDefaultRegistry } from '../../helper/utils';
import { ConnectKeplr } from '../ConnectKeplr';
import { Buffer } from 'buffer';
import { WaitAttestation } from './attestationDialog';
import Web3 from 'web3';

type BurnFormProps = {
  shareAttestation: (attestation: string) => void;
  shareMessageHash: (messageHash: string) => void;
};

export function BurnForm({
  shareAttestation,
  shareMessageHash,
}: BurnFormProps) {
  const { data: account } = useAccount();
  const { data: offlineSigners } = useOfflineSigners();
  const [signClient, setSignClient] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const [recipient, setRecipient] = useState<string>();
  const [mintAmount, setMintAmount] = useState<string>();
  const [txHash, setTxHash] = useState<string>('');
  const [attestation, setAttestation] = useState<string>('');
  const [messageHash, setMessageHash] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const web3 = new Web3(window.ethereum);

  const initClient = async () => {
    if (!account || !offlineSigners) {
      return;
    }

    const signingClient = await SigningStargateClient.connectWithSigner(
      'https://rpc.testnet.noble.strange.love',
      offlineSigners.offlineSigner,
      { registry: createDefaultRegistry() }
    );
    setSignClient(signingClient);
    const balance = await signingClient.getBalance(
      account.bech32Address,
      'uusdc'
    );
    const balanceFormatted = web3.utils.fromWei(Number(balance.amount), 'mwei');
    setBalance(balanceFormatted);
  };

  useEffect(() => {
    initClient();
  }, [account, attestation, messageHash, txHash]);

  const burn = async () => {
    const rawMintRecipient = recipient || '';
    const cleanedMintRecipient = rawMintRecipient.replace(/^0x/, '');
    const zeroesNeeded = 64 - cleanedMintRecipient.length;
    const mintRecipient = '0'.repeat(zeroesNeeded) + cleanedMintRecipient;
    const buffer = Buffer.from(mintRecipient, 'hex');
    const mintRecipientBytes = new Uint8Array(buffer);

    const msg = {
      typeUrl: '/circle.cctp.v1.MsgDepositForBurnWithCaller',
      value: {
        from: account?.bech32Address || '',
        amount: String(Number(mintAmount) * 1000000),
        destinationDomain: 0,
        mintRecipient: mintRecipientBytes,
        burnToken: 'uusdc',
        destinationCaller: mintRecipientBytes,
      },
    };

    const fee = {
      amount: [
        {
          denom: 'uusdc',
          amount: '0',
        },
      ],
      gas: '200000',
    };
    const memo = '';
    setOpen(true);
    signClient
      .signAndBroadcast(account?.bech32Address || '', [msg], fee, memo)
      .then(async (result: any) => {
        setTxHash(result.transactionHash);

        let messageHash = '';
        let attestation = '';

        while (!messageHash || attestation === 'PENDING') {
          const resp = await fetch(
            `https://iris-api-sandbox.circle.com/messages/4/${result.transactionHash}`
          );
          const messageResponse = await resp.json();
          messageHash = messageResponse.error
            ? ''
            : messageResponse?.messages[0].message;
          if (messageHash) {
            setMessageHash(messageHash);
            shareMessageHash(messageHash);
          }
          attestation = messageResponse.error
            ? ''
            : messageResponse?.messages[0].attestation;
          if (attestation && attestation !== 'PENDING') {
            setAttestation(attestation);
            shareAttestation(attestation);
          }
          await new Promise((r) => setTimeout(r, 5000));
        }
      })
      .catch((e: any) => {
        setOpen(false);
        console.log('error', e);
      });
  };

  const resetForm = () => {
    setMintAmount('');
    setRecipient('');
    setTxHash('');
    setAttestation('');
    setMessageHash('');
  };

  const isDisabled =
    !!!account ||
    isNaN(Number(mintAmount)) ||
    !!!recipient ||
    !!!mintAmount ||
    Number(mintAmount) > Number(balance);

  return (
    <div className="flex flex-col">
      <div>
        <WaitAttestation
          open={open}
          setOpen={setOpen}
          txHash={txHash}
          attestation={attestation}
          messageHash={messageHash}
          resetForm={resetForm}
        />
      </div>
      <div className="w-[350px] flex flex-col">
        <div>
          <ConnectKeplr />
        </div>
        <div className="flex justify-between p-1">
          <span className="text-sm text-gray-500">
            {account ? account.bech32Address.slice(0, 14) + '...' : ''}
          </span>
          <span className="text-sm text-gray-500">
            {account && balance ? balance + ' uusdc' : ''}
          </span>
        </div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardDescription className="text-center">
              1. Burn USDC on Noble
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form>
              <div className="grid w-full items-center gap-8">
                <div className="flex flex-col space-y-1.5">
                  {!!mintAmount && isNaN(Number(mintAmount)) && (
                    <div className="text-red-500 text-sm">
                      Please enter a valid amount
                    </div>
                  )}
                  {Number(mintAmount) > Number(balance) && (
                    <div className="text-red-500 text-sm">
                      Insufficient balance
                    </div>
                  )}
                  <Input
                    id="amount"
                    placeholder="Mint amount"
                    value={mintAmount}
                    onChange={(e) => {
                      setMintAmount(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="recipient"
                    placeholder="ETH recipient address"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between mt-28">
            <Button className="w-full" disabled={isDisabled} onClick={burn}>
              Burn
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
