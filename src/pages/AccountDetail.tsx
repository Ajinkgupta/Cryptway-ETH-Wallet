import React, {useEffect, useState} from 'react';
import { sendToken } from '../utils/TransactionUtils';
import { goerli } from '../models/Chain';
import { Account } from '../models/Account';
import AccountTransactions from './AccountTransactions';
import { ethers } from 'ethers';
import { toFixedIfNecessary } from '../utils/AccountUtils';
import './Account.css';

import { Link } from "react-router-dom";
import logo from '../assets/logo.png'
interface AccountDetailProps {
  account: Account
}

const AccountDetail: React.FC<AccountDetailProps> = ({account}) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(account.balance)

  const [networkResponse, setNetworkResponse] = useState<{ status: null | 'pending' | 'complete' | 'error', message: string | React.ReactElement }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
        const provider = new ethers.providers.JsonRpcProvider(goerli.rpcUrl);
        let accountBalance = await provider.getBalance(account.address);
        setBalance((String(toFixedIfNecessary(ethers.utils.formatEther(accountBalance)))));
    }
    fetchData();
}, [account.address])

  function handleDestinationAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(event.target.value);
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(Number.parseFloat(event.target.value));
  }

  async function transfer() {
    // Set the network response status to "pending"
    setNetworkResponse({
      status: 'pending',
      message: '',
    });

    try {
      const { receipt } = await sendToken(amount, account.address, destinationAddress, account.privateKey);

      if (receipt.status === 1) {
        // Set the network response status to "complete" and the message to the transaction hash
        setNetworkResponse({
          status: 'complete',
          message: <p>Transfer complete! <a href={`${goerli.blockExplorerUrl}/tx/${receipt.transactionHash}`} target="_blank" rel="noreferrer">
            View transaction
            </a></p>,
        });
        return receipt;
      } else {
        // Transaction failed
        console.log(`Failed to send ${receipt}`);
        // Set the network response status to "error" and the message to the receipt
        setNetworkResponse({
          status: 'error',
          message: JSON.stringify(receipt),
        });
        return { receipt };
      }
    } catch (error: any) {
      // An error occurred while sending the transaction
      console.error({ error });
      // Set the network response status to "error" and the message to the error
      setNetworkResponse({
        status: 'error',
        message: error.reason || JSON.stringify(error),
      });
    }
  }

  return (
    <>
    <div className="flex pt-[100px] justify-center items-center flex-col w-full min-h-full">
           <img src={logo} className="w-32" />
           <h1 className="text-white font-poppins font-black text-3xl tracking-wide">Welcome </h1>

   <br/>
   <h4 className='text-white'>
            Address: <a href={`https://goerli.etherscan.io/address/${account.address}`} target="_blank" rel="noreferrer">
            {account.address}
            </a><br/>
            Balance: {balance} ETH
        </h4>
  <br/>
           <div className='flex justify-center '> 
    <Link to="/send">  <button
        type="button"
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-3"
     >
      Send ETH
      </button>  </Link> 

  <Link to="/history">    <button
        type="button"
        className="border border-purple-500 text-purple-500 hover:text-white hover:bg-purple-500 py-2 px-4 rounded"
       >
        Transactions
      </button>  </Link> 
      </div>


   </div>  
  
   
 
 </>
     
  )
}

export default AccountDetail;