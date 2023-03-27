import React, { useCallback, useEffect, useState } from 'react';
import { generateAccount } from '../utils/AccountUtils';
import { Account } from '../models/Account';
import AccountDetail from './AccountDetail'; 
import logo from '../assets/logo.png';   

const recoveryPhraseKeyName = 'recoveryPhrase';

function APP() {
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

    const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName)
    if (localStorageRecoveryPhrase) {
      setSeedphrase(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount])

  async function createAccount() {
   const result = await generateAccount();

     setAccount(result.account);
  localStorage.setItem('account', JSON.stringify(result.account));
  window.location.reload();
  }

  useEffect(() => {
  const storedAccount = localStorage.getItem('account');

  if (storedAccount) {
    setAccount(JSON.parse(storedAccount));
  }
}, []);


  return ( 
<>
    {!account &&
    
    <div className="rounded shadow-lg bg-gray-900 p-8 relative h-screen flex flex-col justify-center items-center">
    <img src={logo} className="w-24 h-24 mb-11" /> 
    <h1 className="text-3xl text-white font-bold  text-center mb-8">
      CRYPTWAY
    </h1>
    <form className="items-center" onSubmit={event => event.preventDefault()}>
    <div className='flex justify-center '> 
      <button
        type="button"
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-3"
        onClick={createAccount}
      >
        Create Account
      </button> 
      <button
        type="button"
        className="border border-purple-500 text-purple-500 hover:text-white hover:bg-purple-500 py-2 px-4 rounded"
        onClick={() =>
          showRecoverInput ? recoverAccount(seedphrase) : setShowRecoverInput(true)
        }
        disabled={showRecoverInput && !seedphrase}
      >
        {showRecoverInput ? "Submit Recovery" : "Recover Account"}
      </button> 
      </div>

      {showRecoverInput && (
        <div className="mt-4">
          <label
            htmlFor="seedphrase"
            className="block font-medium text-gray-700 mb-2"
          >
            Seedphrase or Private Key for Recovery
          </label>
          <input
            id="seedphrase"
            type="text"
            placeholder="Enter your seedphrase or private key"
            className="border rounded py-2 px-3 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={seedphrase}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </form>
  </div>
  

  }
  
  {account && 

  <AccountDetail account={account}/>
}
  
  </>
  )

}
export default APP;