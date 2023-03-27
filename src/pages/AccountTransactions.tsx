import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';
import { goerli } from '../models/Chain';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { shortenAddress } from '../utils/AccountUtils';

type AccountTransactionsProps = {
  account: Account,
};


const AccountTransactions: React.FC<AccountTransactionsProps> = ({ account }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [networkResponse, setNetworkResponse] = useState<{ status: null | 'pending' | 'complete' | 'error', message: string | React.ReactElement }>({
    status: null,
    message: '',
  });


  const getTransactions = useCallback(
    (limit: number) => {
      setNetworkResponse({
        status: 'pending',
        message: '',
      });
      TransactionService.getTransactions(account.address, limit).then(response => {
        setTransactions(response.data.result);
      }).catch(error => {
        console.log({error})
        setNetworkResponse({
          status: 'error',
          message: JSON.stringify(error),
        });
      }).finally(()=>{
        setNetworkResponse({
          status: 'complete',
          message: '',
        });
      });
    },[account.address]
  );

  
useEffect(() => {
  getTransactions(10);
}, [getTransactions]);

  return (
    <div className="flex-1 flex justify-start   items-center flex-col   p-5 z-40 ">
     
    <div className="bg-[#2D2F36] mt-20   w-max-full     sm:w-[30rem]   md:w-[32rem] rounded-3xl p-4 content-box">
           
    <div className="AccountTransactions">
  <h2 className="text-2xl font-bold mb-4">Transactions</h2>
  <div className="TransactionsMetaData text-sm mb-4">
    {networkResponse.status === "complete" && transactions.length === 0 && (
      <p>No transactions found for this address</p>
    )}
    {networkResponse.status && (
      <>
        {networkResponse.status === "pending" && (
          <p className="text-purple-600">Loading transactions...</p>
        )}
        {networkResponse.status === "error" && (
          <p className="text-red-600">
            Error occurred while transferring tokens: {networkResponse.message}
          </p>
        )}
      </>
    )}
  </div>
  <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-gray-700 uppercase text-xs font-bold">
          <th className="px-4 py-2">Hash</th>
          <th className="px-4 py-2">From</th>
          <th className="px-4 py-2">To</th>
          <th className="px-4 py-2">Value</th>
          <th className="px-4 py-2">Timestamp</th>
        </tr>
      </thead>
      <tbody className="text-sm font-medium">
        {transactions.map(transaction => (
          <tr key={transaction.hash} className="border-b border-gray-200">
            <td className="px-4 py-2">
              <a
                href={`${goerli.blockExplorerUrl}/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {shortenAddress(transaction.hash)}
              </a>
            </td>
            <td className="px-4 py-2">
              <a
                href={`${goerli.blockExplorerUrl}/address/${transaction.from_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {shortenAddress(transaction.from_address)}
              </a>
              {transaction.from_address.toLowerCase() === account.address.toLowerCase() ? 
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white">OUT</span>
                :
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white">IN</span>
              }
            </td>
            <td className="px-4 py-2">
              <a
                href={`${goerli.blockExplorerUrl}/address/${transaction.to_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {shortenAddress(transaction.to_address)}
              </a>
            </td>
            <td className="px-4 py-2">
              {ethers.utils.formatEther(transaction.value)} ETH
            </td>
            <td className="px-4 py-2">
              {new Date(transaction.block_timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

           
          </div>
      </div>
  );
};

export default AccountTransactions;