import React, { useState } from 'react';

interface IFund {
  name: string;
  code: string;
  currentAmount: string;
  targetPercent: string;
}

interface ITransaction {
  fund: IFund;
  target: number;
  difference: number;
}

function App() {
  const [funds, setFunds] = useState<IFund[]>([
    { name: 'Canadian Index', code: 'TDB900', currentAmount: '', targetPercent: '25' },
    { name: 'USA Index', code: 'TDB902', currentAmount: '', targetPercent: '25' },
    { name: 'Canadian Bonds', code: 'TDB909', currentAmount: '', targetPercent: '25' },
    { name: 'International Index', code: 'TDB911', currentAmount: '', targetPercent: '25' },
  ]);
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const currentTotal = funds.reduce(
    (previous, current) => previous + (parseFloat(current.currentAmount) || 0),
    0,
  );
  const totalPercent = funds.reduce(
    (previous, current) => previous + (parseFloat(current.targetPercent) || 0),
    0,
  );
  const validTotalPercent = totalPercent === 100;

  const amountToPurchaseNum = parseFloat(amountToPurchase) || 0;
  const newTotal = currentTotal + amountToPurchaseNum;

  const transactions: ITransaction[] = funds.map((fund) => {
    const { currentAmount, targetPercent } = fund;
    const currentAmountFloat = parseFloat(currentAmount) || 0;
    const percentMultiplier = (parseInt(targetPercent) || 0) / 100;
    const target = percentMultiplier * newTotal;
    const difference = target - currentAmountFloat;
    return { fund, target, difference };
  });

  const fundsToSell = transactions.filter((transaction) => transaction.difference < 0);
  const totalSell = fundsToSell.reduce((prev, curr) => prev + curr.difference, 0);
  const fundsToBuy = transactions.filter((transaction) => transaction.difference > 0);
  const newDenominator = fundsToBuy.reduce(
    (prev, curr) => prev + (parseInt(curr.fund.targetPercent) || 0),
    0,
  );
  const fundsToBuyMinimizingSales: ITransaction[] = fundsToBuy.map((transaction) => {
    // note this is not guaranteed to remove all sells
    const newPercentMultiplier = (parseInt(transaction.fund.targetPercent) || 0) / newDenominator;
    const difference = transaction.difference + totalSell * newPercentMultiplier;
    const target = (parseFloat(transaction.fund.currentAmount) || 0) + difference;
    return { ...transaction, target, difference };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Portfolio Balancer</h1>

      <h3>Current market values</h3>
      {funds.map((fund, index) => (
        <div
          style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}
          key={index}
        >
          <label>
            $ {fund.name} ({fund.code}):
          </label>
          <input
            type="number"
            value={fund.currentAmount}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].currentAmount = e.target.value;
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
        <label>Total:</label>
        <span>${currentTotal.toLocaleString()}</span>
      </div>

      <h3>Amount to buy</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
        <label>Amount in CAD</label>
        <input
          type="number"
          value={amountToPurchase}
          onChange={(e) => setAmountToPurchase(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
        <label>New total:</label>
        <span>${newTotal.toLocaleString()}</span>
      </div>

      <h3>Desired breakdown</h3>
      {funds.map((fund, index) => (
        <div
          style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}
          key={index}
        >
          <label>
            % {fund.name} ({fund.code}):
          </label>
          <input
            type="number"
            value={fund.targetPercent}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].targetPercent = e.target.value;
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
        <label>Total:</label>
        <span style={{ color: validTotalPercent ? undefined : 'red' }}>{totalPercent}%</span>
      </div>

      {validTotalPercent ? (
        <>
          <h3>Therefore...</h3>
          <ul>
            {transactions.map((transaction) => (
              <Transaction {...transaction} key={transaction.fund.code} />
            ))}
          </ul>
          {fundsToSell.length ? (
            <>
              <h3>To minimize selling...</h3>
              <ul>
                {fundsToBuyMinimizingSales.map((transaction) => (
                  <Transaction {...transaction} key={transaction.fund.code} />
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

const Transaction: React.FC<ITransaction> = ({ fund, target, difference }) => (
  <li>
    {difference >= 0 ? (
      <>
        Buy $
        {difference.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </>
    ) : (
      <>
        Sell $
        {(-difference).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </>
    )}{' '}
    of {fund.name} ({fund.code}) to hit $
    {target.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </li>
);

export default App;
