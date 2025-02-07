import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Account } from '../models/Account';
import { sepolia } from '../models/Chain';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { shortenAddress } from '../utils/AccountUtils';
import { ArrowDownRight, ArrowUpRight, ExternalLink, Loader2 } from 'lucide-react';

type AccountTransactionsProps = {
  account: Account,
};

const AccountTransactions: React.FC<AccountTransactionsProps> = ({ account }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [networkResponse, setNetworkResponse] = useState<{ 
    status: null | 'pending' | 'complete' | 'error', 
    message: string | React.ReactElement 
  }>({
    status: null,
    message: '',
  });

  const getTransactions = useCallback(
    (limit: number) => {
      setNetworkResponse({
        status: 'pending',
        message: '',
      });
      TransactionService.getTransactions(account.address, limit)
        .then(response => {
          setTransactions(response.data.result);
        })
        .catch(error => {
          console.log({error})
          setNetworkResponse({
            status: 'error',
            message: 'Failed to load transactions',
          });
        })
        .finally(() => {
          setNetworkResponse({
            status: 'complete',
            message: '',
          });
        });
    }, [account.address]
  );

  useEffect(() => {
    getTransactions(10);
  }, [getTransactions]);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const isOutgoing = transaction.from_address.toLowerCase() === account.address.toLowerCase();
    
    return (
      <div className="bg-[#363840] rounded-xl p-4 mb-3 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isOutgoing ? (
              <div className="bg-red-500/10 p-2 rounded-lg">
                <ArrowUpRight className="text-red-500" size={20} />
              </div>
            ) : (
              <div className="bg-green-500/10 p-2 rounded-lg">
                <ArrowDownRight className="text-green-500" size={20} />
              </div>
            )}
            <span className="text-lg font-medium">
              {ethers.utils.formatEther(transaction.value)} ETH
            </span>
          </div>
          <a
            href={`${sepolia.blockExplorerUrl}/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <a
              href={`${sepolia.blockExplorerUrl}/address/${transaction.from_address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              {shortenAddress(transaction.from_address)}
            </a>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <a
              href={`${sepolia.blockExplorerUrl}/address/${transaction.to_address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              {shortenAddress(transaction.to_address)}
            </a>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Date:</span>
            <span className="text-gray-300">
              {new Date(transaction.block_timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex justify-start items-center flex-col p-4 z-40">
      <div className="bg-[#2D2F36] mt-16 w-full max-w-2xl rounded-3xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Transactions</h2>
          {networkResponse.status === 'pending' && (
            <Loader2 className="animate-spin text-purple-500" size={24} />
          )}
        </div>

        {networkResponse.status === "complete" && transactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found for this address</p>
          </div>
        )}

        {networkResponse.status === "error" && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-4">
            {networkResponse.message}
          </div>
        )}

        {/* Mobile View - Cards */}
        <div className="md:hidden">
          {transactions.map(transaction => (
            <TransactionCard key={transaction.hash} transaction={transaction} />
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Hash</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map(transaction => {
                const isOutgoing = transaction.from_address.toLowerCase() === account.address.toLowerCase();
                return (
                  <tr key={transaction.hash} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      {isOutgoing ? (
                        <div className="bg-red-500/10 p-1 rounded w-min">
                          <ArrowUpRight className="text-red-500" size={16} />
                        </div>
                      ) : (
                        <div className="bg-green-500/10 p-1 rounded w-min">
                          <ArrowDownRight className="text-green-500" size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`${sepolia.blockExplorerUrl}/tx/${transaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {shortenAddress(transaction.hash)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`${sepolia.blockExplorerUrl}/address/${transaction.from_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {shortenAddress(transaction.from_address)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`${sepolia.blockExplorerUrl}/address/${transaction.to_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {shortenAddress(transaction.to_address)}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ethers.utils.formatEther(transaction.value)} ETH
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400">
                      {new Date(transaction.block_timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTransactions;