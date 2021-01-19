import React, { useState } from 'react';

enum FundCode {
  TDB900 = 'TDB900',
  TDB902 = 'TDB902',
  TDB909 = 'TDB909',
  TDB911 = 'TDB911',
}

interface IFund {
  name: string;
  code: FundCode;
  targetPercent: number;
}

type Holdings = { [code in FundCode]: number };

interface ITransaction {
  fund: IFund;
  target: number;
  difference: number;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '350px',
};

const balanced: IFund[] = [
  { name: 'Canadian Index', code: FundCode.TDB900, targetPercent: 25 },
  { name: 'USA Index', code: FundCode.TDB902, targetPercent: 25 },
  { name: 'Canadian Bonds', code: FundCode.TDB909, targetPercent: 25 },
  { name: 'International Index', code: FundCode.TDB911, targetPercent: 25 },
];

const registered: IFund[] = [
  { name: 'Canadian Index', code: FundCode.TDB900, targetPercent: 10 },
  { name: 'USA Index', code: FundCode.TDB902, targetPercent: 30 },
  { name: 'Canadian Bonds', code: FundCode.TDB909, targetPercent: 30 },
  { name: 'International Index', code: FundCode.TDB911, targetPercent: 30 },
];

const taxable: IFund[] = [
  { name: 'Canadian Index', code: FundCode.TDB900, targetPercent: 40 },
  { name: 'USA Index', code: FundCode.TDB902, targetPercent: 30 },
  { name: 'Canadian Bonds', code: FundCode.TDB909, targetPercent: 0 },
  { name: 'International Index', code: FundCode.TDB911, targetPercent: 30 },
];

function App() {
  const [funds, setFunds] = useState<IFund[]>(balanced);
  const [holdings, setHoldings] = useState<Holdings>(() => ({
    TDB900: 0,
    TDB902: 0,
    TDB909: 0,
    TDB911: 0,
  }));
  const [amountToPurchase, setAmountToPurchase] = useState(0);

  const currentTotal = Object.values(holdings).reduce((previous, current) => previous + current, 0);
  const totalPercent = funds.reduce((previous, current) => previous + current.targetPercent, 0);
  const validTotalPercent = totalPercent === 100;
  const newTotal = currentTotal + amountToPurchase;

  const transactions: ITransaction[] = funds.map((fund) => {
    const { targetPercent } = fund;
    const currentAmount = holdings[fund.code];
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
    const currentAmount = holdings[transaction.fund.code];
    const target = currentAmount + difference;
    return { ...transaction, target, difference };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Portfolio Balancer</h1>

      <h3>Current market values</h3>
      {funds.map((fund, index) => (
        <div style={rowStyle} key={index}>
          <label>
            $ {fund.name} ({fund.code}):
          </label>
          <input
            type="number"
            onChange={(e) => {
              const newFunds = [...funds];
              holdings[fund.code] = parseFloat(e.target.value) || 0;
              setHoldings(holdings);
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={rowStyle}>
        <label>Total:</label>
        <span>${currentTotal.toLocaleString()}</span>
      </div>

      <h3>Amount to buy</h3>
      <div style={rowStyle}>
        <label>Amount in CAD</label>
        <input
          type="number"
          onChange={(e) => setAmountToPurchase(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div style={rowStyle}>
        <label>New total:</label>
        <span>${newTotal.toLocaleString()}</span>
      </div>

      <h3>Desired breakdown</h3>
      {funds.map((fund, index) => (
        <div style={rowStyle} key={index}>
          <label>
            % {fund.name} ({fund.code}):
          </label>
          <input
            type="number"
            value={fund.targetPercent}
            onChange={(e) => {
              const newFunds: IFund[] = JSON.parse(JSON.stringify(funds));
              newFunds[index].targetPercent = parseInt(e.target.value) || 0;
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={rowStyle}>
        <label>Total:</label>
        <span style={{ color: validTotalPercent ? undefined : 'red' }}>{totalPercent}%</span>
      </div>
      <div style={rowStyle}>
        <button onClick={() => setFunds(balanced)}>Balanced</button>
        <button onClick={() => setFunds(registered)}>Registered</button>
        <button onClick={() => setFunds(taxable)}>Taxable</button>
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
