import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';
import Sidebar from './sidebar';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import swap from '../assets/swap.png';
import currencies from '../assets/currencies.png';
import send from '../assets/send.png';
import recieve from '../assets/wallet.png';
import fund from '../assets/fund-ico.png';
import { generateAccount } from '../utils/AccountUtils';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const recoveryPhraseKeyName = 'recoveryPhrase';
  const [seedphrase, setSeedphrase] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [showRecoverInput, setShowRecoverInput] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSeedphrase(event.target.value);
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
    const localStorageRecoveryPhrase = localStorage.getItem(
      recoveryPhraseKeyName
    );
    if (localStorageRecoveryPhrase) {
      setSeedphrase(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount]);

  return (
    <nav className="fixed  w-full justify-between">
      <header className="flex items-center px-0 sm:px-6 py-0 ">
        <div className="flex items-center gap-2 flex-grow basis-0">
          <Link to="/" className="gap-2 flex">
            {' '}
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            <text className="text-white text-2xl font-semibold">
              CRYPTWAY
            </text>{' '}
          </Link>{' '}
        </div>
        <div className="justify-end">
          <div className="flex gap-4">
            <div className="block">
              <button
                type="button"
                className=" flex   z-50   gap-2 px-4 py-[6px] hover:border-[1px] hover:px-[15px] hover:py-[5px] shadow-lg  flex-row justify-center items-center my-5 bg-[#2D2F36]  rounded-l-3xl rounded-r-3xl  cursor-pointer"
              >
                <p className="font-poppins font-bold text text-white ">
                  {account?.address.slice(0, 5) +
                    '...' +
                    account?.address.slice(-4)}
                </p>{' '}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="sm:ml-8 sm:mt-8 fixed  appbar">
        <div className="bg-[#2D2F36]   content-box sm:rounded-xl rounded-t-xl shadow-inner sm:p-3 p-1 grid grid-cols-5 sm:grid-cols-1    gap-4 border-[1.5px] border-[#41444F]">
          <div>
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"
            >
              <img src={recieve} className="w-10 h-10 object-contain" />
            </button>
          </div>
          <div>
            <Link to="/send">
              <button
                type="button"
                className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"
              >
                <img src={send} className="w-10 h-10 object-contain" />
              </button>
            </Link>
          </div>
          <div>
            <Link to="/show-qr">
              <button
                type="button"
                className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"
              >
                {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 object-contain text-white bg-white"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" />
                </svg>{' '}
              </button>
            </Link>
          </div>

          <div>
            <Link to="/scan">
              <button
                type="button"
                className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"
              >
                <svg
                  className="w-10 h-10 object-contain"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.61 122.88"
                >
                  <path
                    className="text-white"
                    d="M26.68,26.77H51.91V51.89H26.68V26.77ZM35.67,0H23.07A22.72,22.72,0,0,0,14.3,1.75a23.13,23.13,0,0,0-7.49,5l0,0a23.16,23.16,0,0,0-5,7.49A22.77,22.77,0,0,0,0,23.07V38.64H10.23V23.07a12.9,12.9,0,0,1,1-4.9A12.71,12.71,0,0,1,14,14l0,0a12.83,12.83,0,0,1,9.07-3.75h12.6V0ZM99.54,0H91.31V10.23h8.23a12.94,12.94,0,0,1,4.9,1A13.16,13.16,0,0,1,108.61,14l.35.36h0a13.07,13.07,0,0,1,2.45,3.82,12.67,12.67,0,0,1,1,4.89V38.64h10.23V23.07a22.95,22.95,0,0,0-6.42-15.93h0l-.37-.37a23.16,23.16,0,0,0-7.49-5A22.77,22.77,0,0,0,99.54,0Zm23.07,99.81V82.52H112.38V99.81a12.67,12.67,0,0,1-1,4.89,13.08,13.08,0,0,1-2.8,4.17,12.8,12.8,0,0,1-9.06,3.78H91.31v10.23h8.23a23,23,0,0,0,16.29-6.78,23.34,23.34,0,0,0,5-7.49,23,23,0,0,0,1.75-8.8ZM23.07,122.88h12.6V112.65H23.07A12.8,12.8,0,0,1,14,108.87l-.26-.24a12.83,12.83,0,0,1-2.61-4.08,12.7,12.7,0,0,1-.91-4.74V82.52H0V99.81a22.64,22.64,0,0,0,1.67,8.57,22.86,22.86,0,0,0,4.79,7.38l.31.35a23.2,23.2,0,0,0,7.5,5,22.84,22.84,0,0,0,8.8,1.75Zm66.52-33.1H96v6.33H89.59V89.78Zm-12.36,0h6.44v6H70.8V83.47H77V77.22h6.34V64.76H89.8v6.12h6.12v6.33H89.8v6.33H77.23v6.23ZM58.14,77.12h6.23V70.79h-6V64.46h6V58.13H58.24v6.33H51.8V58.13h6.33V39.33h6.43V58.12h6.23v6.33h6.13V58.12h6.43v6.33H77.23v6.33H70.8V83.24H64.57V95.81H58.14V77.12Zm31.35-19h6.43v6.33H89.49V58.12Zm-50.24,0h6.43v6.33H39.25V58.12Zm-12.57,0h6.43v6.33H26.68V58.12ZM58.14,26.77h6.43V33.1H58.14V26.77ZM26.58,70.88H51.8V96H26.58V70.88ZM32.71,77h13V89.91h-13V77Zm38-50.22H95.92V51.89H70.7V26.77Zm6.13,6.1h13V45.79h-13V32.87Zm-44,0h13V45.79h-13V32.87Z"
                  />
                </svg>
              </button>
            </Link>
          </div>

          <div>
            <Link to="/history">
              <button
                type="button"
                className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"
              >
                <img src={fund} className="w-10 h-10 object-contain" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <a href="#">
        {' '}
        <button
          type="button"
          className=" fixed gap-2 bg-orange-500  bottom-2 right-5 flex px-6 py-[6px] border-[1px] border-[#41444F] hover:px-[23px] hover:py-[5px] shadow-lg  flex-row justify-center items-center my-5  rounded-l-3xl rounded-r-3xl  cursor-pointer"
        >
          {' '}
          <p className="font-poppins font-bold text text-white text-sm ">
            {' '}
            Request Feature{' '}
          </p>{' '}
        </button>{' '}
      </a>

      <div
        className={`fixed side-z shadow-lg  bottom-20 right-0 bg-[#2D2F36]  rounded-l-xl p-3 grid sm:grid-cols-1   gap-4    ease-in-out duration-300 ${
          showSidebar ? 'translate-x-2 ' : 'translate-x-full'
        }`}
      >
        {' '}
        <Sidebar />{' '}
      </div>
    </nav>
  );
};

export default Navbar;
