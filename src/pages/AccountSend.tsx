import React, {useEffect, useState} from 'react';
import { sendToken } from '../utils/TransactionUtils';
import { goerli } from '../models/Chain';
import { Account } from '../models/Account';
import AccountTransactions from './AccountTransactions';
import { ethers } from 'ethers';
import { toFixedIfNecessary } from '../utils/AccountUtils';
import './Account.css';

interface AccountSendProps {
  account: Account
}

const AccountSend: React.FC<AccountSendProps> = ({account}) => {
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
   
   <div className="flex-1 flex justify-start   items-center flex-col   p-5 z-40 ">
     
      
     <div className="bg-[#2D2F36] mt-20   w-max-full     sm:w-[30rem]   md:w-[32rem] rounded-3xl p-4 content-box">
         
         <div className="px-2 flex items-center text-white justify-between font-semibold text-xl">
           <span>SEND</span>
 
         </div>
    <div className="bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between">
        
    <input
           className="bg-transparent mr-2 rounded h-10 placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl" 
            type="number"
            value={amount}
            onChange={handleAmountChange}
            />
    
         
           <div className="flex w-1/4">
            
             <div className="w-full h-12 flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]">
            
               <div className="flex text-white items-center">
                  <span className="mx-2">ETH</span>
               </div>
              
             </div>
           </div>
         </div>
        
         <div className="bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between">
          
 

         <input
           className=" rounded h-10 bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl"
            placeholder="0x...."  
            type="text"
            value={destinationAddress}
            onChange={handleDestinationAddressChange}
            />
  
         
         </div>
         
        

     
         <button
            className="bg-purple-600 my-2  w-full rounded-3xl py-2 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-black hover:border-[#234169]"  
           type="button"
            onClick={transfer}
            disabled={!amount || networkResponse.status === 'pending'}
        >
            Send {amount} ETH
        </button>

        {networkResponse.status &&
            <>
            {networkResponse.status === 'pending' && <p>Transfer is pending...</p>}
            {networkResponse.status === 'complete' && <p>{networkResponse.message}</p>}
            {networkResponse.status === 'error' && <p>Error occurred while transferring tokens: {networkResponse.message}</p>}
            </>
        }
 
       </div>
   </div>
   
   </>

  )
}

export default AccountSend;