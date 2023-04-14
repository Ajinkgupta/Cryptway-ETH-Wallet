import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';   
import { generateAccount } from '../utils/AccountUtils';
import { QRCodeCanvas } from "qrcode.react";    

const Recieve = () => {  

   
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
  <div className="flex-1 flex justify-center items-center p-5">
   <div className="bg-[#2D2F36] mt-20 w-full sm:w-[30rem] md:w-[32rem] rounded-3xl p-4 content-box shadow-lg">
          
   <div className='text-center mx-auto my-4 rounded-md font-bold text-lg text-white'>My QR-CODE</div>

 {account?.address && <QRCodeCanvas
  id="qrCode"
  size={200}
  value={account?.address}
  bgColor="#2D2F36"
  fgColor="#ffffff"
  level={"H"}

  className="w-[300px] h-[300px] mx-auto my-4 rounded-md  "
/>
} 

         
        </div>
      </div>
 
 </>
 
  );
};

export default Recieve;

 