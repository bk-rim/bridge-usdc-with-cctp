import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import gifImage from '../../assets/Hourglass.gif';
import { Copy } from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  txHash: string;
  attestation: string;
  messageHash: string;
  resetForm: () => void;
};

export const WaitAttestation = (props: Props) => {
  const { open, setOpen, txHash, attestation, messageHash, resetForm } = props;

  return (
    <Dialog open={open}>
      <DialogContent
        className={`flex flex-col ${txHash ? 'w-[calc(100vw/2)]' : ''}`}
      >
        {!!!txHash ? (
          <img src={gifImage} alt="Your GIF Image" className="mx-auto mt-4" />
        ) : (
          <div className="flex flex-col gap-6">
            <span className="text-4xl text-center">Transaction Details</span>
            <span className="text-center">
              You can see the transaction on the following links:
            </span>
            <span className="text-center">
              <a
                href={`https://mintscan.io/noble-testnet/tx/${txHash}`}
                target="blank"
              >{`https://mintscan.io/noble-testnet/tx/${txHash}`}</a>
            </span>
            {!!!attestation && (<span className="text-center">Waiting for attestation...</span>)}
            {!!!attestation && (
              <img
                src={gifImage}
                alt="Your GIF Image"
                className="mx-auto mt-4"
              />
            )}
            {!!!attestation && (
              <span className="text-center text-lg">
                You need to wait for the attestation and messageHash to mint on
                Ethereum
              </span>
            )}
            <span className="text-center text-lg text-rose-500">
              Please do not quit or refresh the page
            </span>

            <div className="flex flex-col space-y-4">
              {!!attestation && (<div className="flex gap-2 justify-center">
                <span className="text-lg">Attestation and MessageHash will be filled automatically in mint Form</span>
                </div>)
              }
              {!!messageHash && (
                <div className="flex gap-2">
                  <span className="text-lg">Message Hash:</span>
                  <span className="text-lg">
                    {messageHash ? messageHash.slice(0, 65) + '...' : ''}
                  </span>
                  <Button
                    onClick={() => navigator.clipboard.writeText(messageHash)}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              )}
              {!!attestation && (
                <div className="flex gap-2">
                  <span className="text-lg">Attestation:</span>
                  <span className="text-lg">
                    {attestation ? attestation.slice(0, 69) + '...' : ''}
                  </span>
                  <Button
                    onClick={() => navigator.clipboard.writeText(attestation)}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              )}
            </div>
            {!!messageHash && !!attestation && (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    resetForm();      
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
