import React, { useCallback, useEffect, useState } from 'react';
import { generateAccount } from '../utils/AccountUtils';
import { Account } from '../models/Account';
import AccountDetail from './AccountDetail';
import logo from '../assets/logo.png';
import { KeyRound, Plus } from 'lucide-react';

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
      {!account && (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <img 
                  src={logo} 
                  className="w-24 h-24 mb-6 animate-pulse" 
                  alt="Cryptway Logo"
                />
                <div className="absolute inset-0 bg-purple-500 opacity-20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                CRYPTWAY
              </h1>
            
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/25"
                  onClick={createAccount}
                >
                  <Plus className="w-5 h-5" />
                  Create New Account
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border-2 border-purple-500/50 text-purple-400 hover:text-white hover:bg-purple-600 hover:border-transparent py-3 px-6 rounded-xl font-medium transition-all duration-200"
                  onClick={() => showRecoverInput ? recoverAccount(seedphrase) : setShowRecoverInput(true)}
                  disabled={showRecoverInput && !seedphrase}
                >
                  <KeyRound className="w-5 h-5" />
                  {showRecoverInput ? "Recover Account" : "Use Existing Account"}
                </button>
              </div>

              {showRecoverInput && (
                <div className="mt-6 space-y-4">
                  <label
                    htmlFor="seedphrase"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Enter Recovery Phrase or Private Key
                  </label>
                  <div className="relative">
                    <input
                      id="seedphrase"
                      type="text"
                      placeholder="Enter your recovery phrase..."
                      className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      value={seedphrase}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="absolute inset-0 bg-purple-500/5 rounded-xl pointer-events-none"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Please ensure you enter the correct recovery phrase to access your account
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {account && <AccountDetail account={account} />}
    </>
  );
}

export default APP;