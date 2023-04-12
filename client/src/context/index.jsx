import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';

import { ABI, ADDRESS } from '../contract';
import { createEventListeners } from './CreateEventListeners';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [battleGround, setBattleGround] = useState('bg-astral');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [step, setStep] = useState(1);
    const [gameData, setGameData] = useState({ players: [], pendingBattles: [], activeBattle: null });
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });
    const [battleName, setBattleName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [updateGameData, setUpdateGameData] = useState(0);
    
    const player1Ref = useRef();
    const player2Ref = useRef();
    
    const navigate = useNavigate();


    
     //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({ method: 'eth_accounts' }); //'eth_accounts'
        
      if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
  }, []);
    
    
    
      //* Set the smart contract and provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

   //* Activate event listeners for the smart contract
   useEffect(() => {
    if (contract) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        // player1Ref,
        // player2Ref,
        // setUpdateGameData,
      });
    }
  }, [contract]);
    
      //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);
    

    return (
      <GlobalContext.Provider value={{
        contract, walletAddress, showAlert, setShowAlert, errorMessage, setErrorMessage,
            
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

// helper
export const useGlobalContext = () => useContext(GlobalContext);