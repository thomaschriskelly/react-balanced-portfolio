import React, { useState } from 'react';

interface IFund {
  name: string;
  code: string;
  currentAmount: number;
  targetPercent: number;
}

interface ITransaction {
  fund: IFund;
  target: number;
  difference: number;
}

function App() {
  const [funds, setFunds] = useState<IFund[]>([
    { name: 'Canadian Index', code: 'TDB900', currentAmount: 0, targetPercent: 25 },
    { name: 'USA Index', code: 'TDB902', currentAmount: 0, targetPercent: 25 },
    { name: 'Canadian Bonds', code: 'TDB909', currentAmount: 0, targetPercent: 25 },
    { name: 'International Index', code: 'TDB911', currentAmount: 0, targetPercent: 25 },
  ]);
  const [amountToPurchase, setAmountToPurchase] = useState(0);

  const currentTotal = funds.reduce((previous, current) => previous + current.currentAmount, 0);
  const totalPercent = funds.reduce((previous, current) => previous + current.targetPercent, 0);
  const validTotalPercent = totalPercent === 100;
  const newTotal = currentTotal + amountToPurchase;

  const transactions: ITransaction[] = funds.map((fund) => {
    const { currentAmount, targetPercent } = fund;
    const percentMultiplier = targetPercent / 100;
    const target = percentMultiplier * newTotal;
    const difference = target - currentAmount;
    return { fund, target, difference };
  });

  const sellTransactions = transactions.filter((transaction) => transaction.difference < 0);
  const totalSell = sellTransactions.reduce((prev, curr) => prev + curr.difference, 0);
  const buyTransactions = transactions.filter((transaction) => transaction.difference > 0);
  const newDenominator = buyTransactions.reduce((prev, curr) => prev + curr.fund.targetPercent, 0);
  const buyTransactionsMinimizingSales: ITransaction[] = buyTransactions.map((transaction) => {
    // note this is not guaranteed to remove all sells
    const percentMultiplier = transaction.fund.targetPercent / newDenominator;
    const difference = transaction.difference + totalSell * percentMultiplier;
    const target = transaction.fund.currentAmount + difference;
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
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].currentAmount = parseFloat(e.target.value) || 0;
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
          onChange={(e) => setAmountToPurchase(parseFloat(e.target.value) || 0)}
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
            defaultValue={fund.targetPercent}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].targetPercent = parseInt(e.target.value) ?? 0;
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
          {sellTransactions.length ? (
            <>
              <h3>To minimize selling...</h3>
              <ul>
                {buyTransactionsMinimizingSales.map((transaction) => (
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
