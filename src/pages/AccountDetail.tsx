import React, {useEffect, useState} from 'react';
import { sendToken } from '../utils/TransactionUtils';
import { sepolia } from '../models/Chain';
import { Account } from '../models/Account';
import AccountTransactions from './AccountTransactions';
import { ethers } from 'ethers';
import { toFixedIfNecessary } from '../utils/AccountUtils';
import './Account.css';
import Avatar from "boring-avatars";

import { Link } from "react-router-dom"; 
interface AccountDetailProps {
  account: Account
}

const AccountDetail: React.FC<AccountDetailProps> = ({account}) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(account.balance)
  const [exchangeRate, setExchangeRate] = useState(172729.85); // current ETH to INR exchange rate
  const [isCopied, setIsCopied] = useState(false);
  const [networkResponse, setNetworkResponse] = useState<{ status: null | 'pending' | 'complete' | 'error', message: string | React.ReactElement }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
        const provider = new ethers.providers.JsonRpcProvider(sepolia.rpcUrl);
        let accountBalance = await provider.getBalance(account.address);
        setBalance((String(toFixedIfNecessary(ethers.utils.formatEther(accountBalance)))));
    }
    fetchData();
}, [account.address])

const balanceInRupees = balance ? parseFloat(balance) * exchangeRate : null;

  function handleDestinationAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(event.target.value);
  }
  
  function copyToClipboard() {
    navigator.clipboard.writeText(account.address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // show the message for 1 second
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
          message: <p>Transfer complete! <a href={`${sepolia.blockExplorerUrl}/tx/${receipt.transactionHash}`} target="_blank" rel="noreferrer">
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
    <div className="flex pt-[150px] justify-center items-center flex-col w-full min-h-full">
    <Avatar 
          name={account.address}
          variant="beam"
          className="w-24 h-24 rounded-full"
        />
            
             <br/>
           <h1 className="text-white font-poppins font-black text-3xl tracking-wide"> Account </h1>
  
           <p className='font-bold text-gray-500 text-lg'> ₹ {balanceInRupees} | {balance} ETH </p>

    
   <h4 className='text-white flex justify-center items-center'>
       <div className='flex   w-[200px]  z-50   gap-2 px-4 py-[6px] hover:border-[1px] hover:px-[15px] hover:py-[5px] shadow-lg  flex-row justify-center items-center my-5 bg-[#2D2F36]  rounded-l-3xl rounded-r-3xl  cursor-pointer'>   <a href={`https://sepolia.etherscan.io/address/${account.address}`} target="_blank" rel="noreferrer">
           {account?.address.slice(0, 8) + '...' + account?.address.slice(-4)} 
            </a>
            <button onClick={copyToClipboard} className='ml-2'>     <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 text-purple-500' viewBox="0 0 512 512"><path d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"/></svg>
            </button> </div>  </h4>
            <div className='flex justify-center items-center'> 
  
            {isCopied && (
  <p className="fixed top-[100px] mx-auto w-[200px] shadow-md z-50 rounded-3xl p-2 text-center bg-purple-400 fade">
    ✅ Address Copied!
  </p>
)}


</div>
  

         
  <br/>
           <div className='flex justify-center '> 
    <Link to="/show-qr">  <button
        type="button"
        className="border border-purple-500  mr-3 font-bold hover:text-white hover:bg-purple-500 py-2 px-4 text-gray-500 rounded-3xl"
      >
My QR
      </button>  </Link> 
      <Link to="/send">  <button
        type="button"
        className="bg-purple-500 font-bold hover:bg-purple-600  py-2 px-4 rounded-3xl mr-3  text-white"
     >
     Send ETH
      </button>  </Link> 

  <Link to="/history">    <button
        type="button"
        className="border border-purple-500   font-bold hover:text-white hover:bg-purple-500 py-2 px-4 text-gray-500 rounded-3xl"
       >
        History
      </button>  </Link> 
      </div>


   </div>  
  <div className='h-[100px]'></div>
   
 
 </>
     
  )
}

export default AccountDetail;
