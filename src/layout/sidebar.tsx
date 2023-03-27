import { QRCodeCanvas } from "qrcode.react";    
import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';  
import logo from '../assets/logo.png'; 
import { Link } from "react-router-dom";
import swap from   "../assets/swap.png"; 
import currencies from "../assets/currencies.png"; 
import send from "../assets/send.png"; 
import recieve from "../assets/wallet.png";   
import fund from "../assets/fund-ico.png"; 
import { generateAccount } from '../utils/AccountUtils';

const Sidebar = () => { 
  const recoveryPhraseKeyName = 'recoveryPhrase';
  const [seedphrase, setSeedphrase] = useState('');
 const [account, setAccount] = useState<Account | null>(null);
  const [showRecoverInput, setShowRecoverInput] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSeedphrase(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      recoverAccount(seedphrase);
    }
  }

 const recoverAccount = useCallback(
   async (recoveryPhrase: string) => {
     const result = await generateAccount(recoveryPhrase);
   
   setAccount(result.account);

    if (localStorage.getItem(recoveryPhraseKeyName) !== recoveryPhrase) {
      localStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
    }

  }, []
);


 useEffect(() => {
 const storedAccount = localStorage.getItem('account');

 if (storedAccount) {
   setAccount(JSON.parse(storedAccount));
 }
}, []);

useEffect(() => {

 const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName)
 if (localStorageRecoveryPhrase) {
   setSeedphrase(localStorageRecoveryPhrase);
   recoverAccount(localStorageRecoveryPhrase);
 }
}, [recoverAccount])
  return (
    
        <>
         <div className="p-3 flex justify-end  shadow-2xl items-start flex-col rounded-xl h-40 w-72  bg-gradient-to-tr from-gray-900 to-gray-700  my-5 bg-black white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-50 h-50   flex justify-center items-center">
                 
   <div className="p-[2px]  rounded-[2px] white-glassmorphism">
   {account?.address && <QRCodeCanvas
id="qrCode" 
size={80}
value={account?.address}
bgColor={"#F4C430"}
level={"H"} 
className=" "
/> } 
   </div> </div> 
               <p className="text-white font-poppins font-bold text-lg mt-1">
                  CRYPTWAY
                </p>
                <img src={logo}  className="w-8 h-8" alt="" />
              </div>
              <div>
                <p className="font-poppins font-normal text-white text-[10px] text-center "> {account?.address}</p> 
              </div>
            </div>
          </div>
        
        
 <Link to="/history"> 
<button
                type="button"
                  
                  className="  px-4 py-[6px] hover:border-[1px] hover:px-[15px] hover:py-[5px] shadow-lg  text-white    w-full text-center  rounded-l-3xl rounded-r-3xl  cursor-pointer bg-purple-600  "
                >
                   <p className="font-poppins  font-bold text text-white text-sm ">
                  Transaction History
                  </p> 
                </button> </Link>

        </>
       
 
  );
};

export default Sidebar;