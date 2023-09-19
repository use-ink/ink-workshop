import { useMemo } from 'react';
import {
  Button,
  Card,
  ConnectButton,
  InkLayout,
  Link,
  formatContractName,
} from 'ui';
import { useBalance, useCallSubscription, useContract, useTx, useWallet } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import {
  decimalToPlanck,
  isPendingSignature,
  pickDecoded,
  planckToDecimal,
  planckToDecimalFormatted,
  shouldDisable,
  stringNumberToBN,
} from 'useink/utils';
import metadata from './assets/smart_faucet.json';
import { CONTRACT_ROCOCO_ADDRESS } from './constants';

function App() {
  const { account } = useWallet();
  const chainContract = useContract(CONTRACT_ROCOCO_ADDRESS, metadata);
  const contractBalance = useBalance({ address: CONTRACT_ROCOCO_ADDRESS });
  const userBalance = useBalance(account);
  const giveMe = useTx(chainContract, 'giveMe');
  const getAmount = useCallSubscription<string>(chainContract, 'getAmount', []);
  const amount = pickDecoded(getAmount.result) || '0';
  useTxNotifications(giveMe);

  const planckAmount = useMemo(
    () => decimalToPlanck(stringNumberToBN(amount), { api: chainContract?.contract?.api }) || 0,
    [amount],
  );

  const decimalAmount = useMemo(
    () => planckToDecimal(stringNumberToBN(amount), { api: chainContract?.contract?.api }) || 0,
    [amount]
  )


  const needsMoreFunds = useMemo(
    () =>
      contractBalance?.freeBalance.lt(
        stringNumberToBN(amount?.toString() || '0'),
      ),
    [contractBalance?.freeBalance, planckAmount],
  );


  return (
    <InkLayout
      className="md:py-12 md:p-6 p-4 h-screen flex items-center justify-center"
      animationSrc="https://raw.githubusercontent.com/paritytech/ink-workshop/d819d10a35b2ac3d2bff4f77a96701a527b3ad3a/frontend/public/dark-sea-creatures.json"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <Card className="mx-auto p-6 flex flex-col w-full max-w-md backdrop-blur-sm bg-opacity-70">
          <h1 className="text-2xl font-bold">
            {formatContractName(metadata.contract.name)}
          </h1>

          <hgroup className="mt-6 mb-2 ml-2 text-white/80 text-xs">
            <h3>
              Contract Balance:{' '}
              <b className="uppercase">
                {contractBalance
                  ? planckToDecimalFormatted(contractBalance?.freeBalance, {
                    api: chainContract?.contract.api,
                    significantFigures: 4,
                  })
                  : '--'}
              </b>
            </h3>

            <h3>
              Your Balance:{' '}
              <b className="uppercase">
                {userBalance
                  ? planckToDecimalFormatted(userBalance?.freeBalance, {
                    api: chainContract?.contract.api,
                    significantFigures: 4,
                  })
                  : '--'}
              </b>
            </h3>
          </hgroup>

          {account ? (
            <Button
              disabled={shouldDisable(giveMe) || needsMoreFunds}
              onClick={() => giveMe.signAndSend()}
              className="mt-6"
            >
              {isPendingSignature(giveMe)
                ? 'Please sign transaction...'
                : shouldDisable(giveMe)
                  ? `Sending you ${decimalAmount} ROC...`
                  : `Withdraw ${decimalAmount} ROC`}
            </Button>
          ) : (
            <ConnectButton className="mt-6" />
          )}

          <div className="text-center mt-6">
            {needsMoreFunds && (
              <p className="mb-3">There are not enough funds.</p>
            )}

            <Link
              href={`https://use.ink/faucet?acc=${CONTRACT_ROCOCO_ADDRESS}`}
              target="_blank"
            >
              Add ROC to contract with faucet
            </Link>
          </div>
        </Card>
      </div>
    </InkLayout>
  );
}

export default App;
