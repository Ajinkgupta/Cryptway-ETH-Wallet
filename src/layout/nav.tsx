import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';
import Sidebar from './sidebar';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { generateAccount } from '../utils/AccountUtils';
import { 
  Wallet, 
  Send, 
  QrCode, 
  ScanLine, 
  History,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
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
  };

  const recoverAccount = useCallback(async (recoveryPhrase: string) => {
    const result = await generateAccount(recoveryPhrase);
    setAccount(result.account);

    if (localStorage.getItem(recoveryPhraseKeyName) !== recoveryPhrase) {
      localStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
    }
  }, []);

  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }
  }, []);

  useEffect(() => {
    const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName);
    if (localStorageRecoveryPhrase) {
      setSeedphrase(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavButton = ({ to, icon: Icon, isActive: active }: { to: string; icon: React.ElementType; isActive: boolean }) => (
    <Link to={to}>
      <button
        type="button"
        className={`p-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:bg-[#41444F] ${
          active ? 'bg-[#41444F] shadow-inner' : ''
        }`}
      >
        <Icon className={`w-8 h-8 ${active ? 'text-purple-500' : 'text-gray-300'}`} />
      </button>
    </Link>
  );

  return (
    
    <nav className="fixed w-full justify-between z-50">
      {account && (
      <header className="flex items-center px-4 sm:px-6 py-0">
        <div className="flex items-center gap-2 flex-grow basis-0">
          <Link to="/" className="gap-2 flex">
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            <text className="text-white text-2xl font-semibold">
              CRYPTWAY
            </text>
          </Link>
        </div>
        
        
          <div className="justify-end">
            <div className="flex gap-4">
              <div className="block">
                <button
                  type="button"
                  className="flex z-50 gap-2 px-4 py-[6px] hover:border-[1px] hover:px-[15px] hover:py-[5px] shadow-lg flex-row justify-center items-center my-5 bg-[#2D2F36] rounded-l-3xl rounded-r-3xl cursor-pointer"
                >
                  <p className="font-poppins font-bold text text-white">
                    {account.address.slice(0, 5) + '...' + account.address.slice(-4)}
                  </p>
                </button>
              </div>
            </div>
          </div>
 
      </header>
              )}

      {account && (
        <>
          <div className="fixed bottom-0 sm:bottom-auto sm:top-24 left-0 sm:left-6 right-0 sm:right-auto p-4 sm:p-0">
            <div className="bg-[#2D2F36] rounded-2xl sm:rounded-xl shadow-xl border border-gray-700/50 p-2 grid grid-cols-5 sm:grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:bg-[#41444F] ${
                  showSidebar ? 'bg-[#41444F] shadow-inner' : ''
                }`}
              >
                <Wallet className={`w-8 h-8 ${showSidebar ? 'text-purple-500' : 'text-gray-300'}`} />
              </button>
              <NavButton to="/send" icon={Send} isActive={isActive('/send')} />
              <NavButton to="/show-qr" icon={QrCode} isActive={isActive('/show-qr')} />
              <NavButton to="/scan" icon={ScanLine} isActive={isActive('/scan')} />
              <NavButton to="/history" icon={History} isActive={isActive('/history')} />
            </div>
          </div>
 

          <div
            className={`fixed side-z shadow-xl bottom-28 sm:bottom-auto sm:top-24 right-0 bg-[#2D2F36] rounded-l-xl border-l border-t border-b border-gray-700/50 transition-transform duration-300 ease-out ${
              showSidebar ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Sidebar />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;