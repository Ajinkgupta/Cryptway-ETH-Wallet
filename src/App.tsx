import React, { useCallback, useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import APP from './pages/App';
import AccountSend from './pages/AccountSend';
import Navbar from './layout/nav'
import { Account } from './models/Account'; 
import AccountTransactions from './pages/AccountTransactions';

import { generateAccount } from './utils/AccountUtils';
function App() {
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
    <Router>
    <div className="bg-[#202124] w-full min-h-screen">

  <Navbar />
    <Routes>
      <Route path="/" element={<APP/>} />
      <Route path="/send" element={account ? <AccountSend account={account} /> : null} />
      <Route path="/history" element={account ? <AccountTransactions account={account} /> : null} />

      <Route path="/swap" element={<Swap />} />
        <Route path="/currencies" element={<Currencies />} />
    </Routes>
    
    </div>
  </Router>
  );
}

function Swap() {
  window.location.replace("https://swap.cryptway.in/");
  return null;
}
function Currencies() {
  window.location.replace("https://cryptwaycurrencies.netlify.app/");
  return null;
}

export default App;
