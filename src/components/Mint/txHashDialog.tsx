import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import gifImage from '../../assets/Hourglass.gif';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  txHash: string;
  resetForm: () => void;
};

export const TxHashDialog = (props: Props) => {
  const { open, setOpen, txHash, resetForm } = props;

  return (
    <Dialog open={open}>
      <DialogContent
        className={`flex flex-col ${txHash ? 'w-[calc(100vw/2)]' : ''}`}
      >
        {!!!txHash ? (
          <img src={gifImage} alt="Your GIF Image" className="mx-auto mt-4" />
        ) : (
          <div className="flex flex-col gap-6 items-center">
            <span className="text-4xl text-center">Transaction Details</span>
            <span>You can see the transaction on the following links:</span>
            <span>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="blank"
              >{`https://sepolia.etherscan.io/tx/${txHash}`}</a>
            </span>
            <Button
              className="w-1/6"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
