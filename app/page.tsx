'use client';

import Image from "next/image";
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
    const percentMultiplier = transaction.fund.targetPercent / newDenominator;
    const difference = transaction.difference + totalSell * percentMultiplier;
    const currentAmount = holdings[transaction.fund.code];
    const target = currentAmount + difference;
    return { ...transaction, target, difference };
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
          Portfolio Balancer
        </h1>

        <section className="w-full mb-8">
          <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50 mb-4">
            Current market values
          </h3>
          <div className="flex flex-col gap-3">
            {funds.map((fund, index) => (
              <div className="flex justify-between items-center" key={index}>
                <label className="text-zinc-600 dark:text-zinc-400">
                  $ {fund.name} ({fund.code}):
                </label>
                <input
                  type="number"
                  className="w-48 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 px-3 py-2 text-right text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-50"
                  onChange={(e) => {
                    const newFunds = [...funds];
                    holdings[fund.code] = parseFloat(e.target.value) || 0;
                    setHoldings(holdings);
                    setFunds(newFunds);
                  }}
                />
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-black/[.08] dark:border-white/[.145]">
              <label className="font-medium text-zinc-950 dark:text-zinc-50">Total:</label>
              <span className="font-medium text-zinc-950 dark:text-zinc-50">${currentTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="w-full mb-8">
          <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50 mb-4">
            Amount to buy
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-zinc-600 dark:text-zinc-400">Amount in CAD</label>
              <input
                type="number"
                className="w-48 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 px-3 py-2 text-right text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-50"
                onChange={(e) => setAmountToPurchase(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-black/[.08] dark:border-white/[.145]">
              <label className="font-medium text-zinc-950 dark:text-zinc-50">New total:</label>
              <span className="font-medium text-zinc-950 dark:text-zinc-50">${newTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="w-full mb-8">
          <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50 mb-4">
            Desired breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {funds.map((fund, index) => (
              <div className="flex justify-between items-center" key={index}>
                <label className="text-zinc-600 dark:text-zinc-400">
                  % {fund.name} ({fund.code}):
                </label>
                <input
                  type="number"
                  value={fund.targetPercent}
                  className="w-48 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 px-3 py-2 text-right text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-50"
                  onChange={(e) => {
                    const newFunds: IFund[] = JSON.parse(JSON.stringify(funds));
                    newFunds[index].targetPercent = parseInt(e.target.value) || 0;
                    setFunds(newFunds);
                  }}
                />
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-black/[.08] dark:border-white/[.145]">
              <label className="font-medium text-zinc-950 dark:text-zinc-50">Total:</label>
              <span className={`font-medium ${validTotalPercent ? 'text-zinc-950 dark:text-zinc-50' : 'text-red-500'}`}>
                {totalPercent}%
              </span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setFunds(balanced)}
                className="flex-1 h-10 rounded-full border border-black/[.08] dark:border-white/[.145] text-zinc-950 dark:text-zinc-50 font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
              >
                Balanced
              </button>
              <button
                onClick={() => setFunds(registered)}
                className="flex-1 h-10 rounded-full border border-black/[.08] dark:border-white/[.145] text-zinc-950 dark:text-zinc-50 font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
              >
                Registered
              </button>
              <button
                onClick={() => setFunds(taxable)}
                className="flex-1 h-10 rounded-full border border-black/[.08] dark:border-white/[.145] text-zinc-950 dark:text-zinc-50 font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
              >
                Taxable
              </button>
            </div>
          </div>
        </section>

        {validTotalPercent && (
          <section className="w-full mb-8">
            <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50 mb-4">
              Therefore...
            </h3>
            <ul className="flex flex-col gap-2">
              {transactions.map((transaction) => (
                <Transaction {...transaction} key={transaction.fund.code} />
              ))}
            </ul>
            {sellTransactions.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50 mb-4 mt-8">
                  To minimize selling...
                </h3>
                <ul className="flex flex-col gap-2">
                  {buyTransactionsMinimizingSales.map((transaction) => (
                    <Transaction {...transaction} key={transaction.fund.code} />
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

const Transaction: React.FC<ITransaction> = ({ fund, target, difference }) => {
  const copyAmount = () => {
    navigator.clipboard.writeText(Math.floor(difference).toString());
  };

  return (
    <li className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      {difference >= 0 ? (
        <>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Buy ${difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <button
            onClick={copyAmount}
            className="ml-2 px-2 py-0.5 text-xs rounded border border-black/[.08] dark:border-white/[.145] text-zinc-600 dark:text-zinc-400 hover:bg-black/[.04] dark:hover:bg-[#1a1a1a] transition-colors"
            title={`Copy $${Math.floor(difference)}`}
          >
            Copy
          </button>
        </>
      ) : (
        <span className="text-red-500 dark:text-red-400 font-medium">
          Sell ${(-difference).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}{' '}
      of {fund.name} ({fund.code}) to hit{' '}
      <span className="text-zinc-950 dark:text-zinc-50 font-medium">
        ${target.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </li>
  );
};

export default App;

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
