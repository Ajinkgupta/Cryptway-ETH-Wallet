import React, { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account'; 
import Sidebar from './sidebar';
import logo from '../assets/logo.png'; 
import { Link } from "react-router-dom";
import swap from   "../assets/swap.png"; 
import currencies from "../assets/currencies.png"; 
import send from "../assets/send.png"; 
import recieve from "../assets/wallet.png";   
import fund from "../assets/fund-ico.png"; 
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
  <nav className="fixed  w-full justify-between">
  
          <header className="flex items-center px-0 sm:px-6 py-0 ">
            <div className="flex items-center gap-2 flex-grow basis-0"> 
           <Link to="/" className='gap-2 flex'>    <img src={logo} alt="logo" className="w-8 h-8 object-contain"  /><text className="text-white text-2xl font-semibold">CRYPTWAY</text>   </Link>   </div> 
            <div className="justify-end"> 
            <div className="flex gap-4">
            <div className="block">
               <button  type="button" className=" flex   z-50   gap-2 px-4 py-[6px] hover:border-[1px] hover:px-[15px] hover:py-[5px] shadow-lg  flex-row justify-center items-center my-5 bg-[#2D2F36]  rounded-l-3xl rounded-r-3xl  cursor-pointer"><p className="font-poppins font-bold text text-white ">{account?.address.slice(0, 5) + '...' + account?.address.slice(-4)}</p>  </button>
            </div>  
            </div>
            </div>
          </header>
           






          <div className="sm:ml-8 sm:mt-8 fixed  appbar">
            <div className="bg-[#2D2F36]   content-box sm:rounded-xl rounded-t-xl shadow-inner sm:p-3 p-1 grid grid-cols-5 sm:grid-cols-1    gap-4 border-[1.5px] border-[#41444F]">
            <div>
            <button type="button"  onClick={() => setShowSidebar(!showSidebar)} className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"><img src={recieve}  className="w-10 h-10 object-contain" /></button>
            </div>
            <div>
            <Link to="/send"><button type="button" className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"><img src={send}  className="w-10 h-10 object-contain" /></button></Link>
            </div>

            <div>
            <Link to="/swap"><button type="button" className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"><img src={swap}  className="w-10 h-10 object-contain" /></button></Link>
            </div>

            <div>
            <Link to="/history"><button type="button" className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"><img src={fund}  className="w-10 h-10 object-contain" /></button></Link>
            </div>

            <div>
            <Link to="/currencies"><button type="button" className=" p-2 rounded  hover:shadow hover:bg-[#41444F]"><img src={currencies}  className="w-10 h-10 object-contain" /></button></Link>
            </div>
            </div>
          </div> 

  



          <a   href="https://github.com/orgs/cryptway/discussions" >  <button  type="button" className=" fixed gap-2 bg-purple-600  bottom-2 right-5 flex px-6 py-[6px] border-[1px] border-[#41444F] hover:px-[23px] hover:py-[5px] shadow-lg  flex-row justify-center items-center my-5  rounded-l-3xl rounded-r-3xl  cursor-pointer">                   <p className="font-poppins font-bold text text-white text-sm "> Request Feature  </p> </button> </a> 
  
  
          <div  className={`fixed side-z shadow-lg  bottom-20 right-0 bg-[#2D2F36]  rounded-l-xl p-3 grid sm:grid-cols-1   gap-4    ease-in-out duration-300 ${ showSidebar ? "translate-x-2 " : "translate-x-full"}`}>  <Sidebar/>  </div>
   
   
   </nav>
 
  );
};

export default Navbar;

 