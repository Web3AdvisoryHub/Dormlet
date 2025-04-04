import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { 
  connectWalletRequest, 
  connectWalletSuccess, 
  connectWalletFailure,
  disconnectWallet,
  updateChainId
} from '../store/walletSlice';
import { RootState } from '../store';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { address, isConnected, chainId, isConnecting, error } = useSelector(
    (state: RootState) => state.wallet
  );
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Initialize provider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      setProvider(ethersProvider);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          dispatch(disconnectWallet());
        } else if (accounts[0] !== address) {
          // User switched accounts
          connectWallet();
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        dispatch(updateChainId(newChainId));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address, dispatch]);

  const connectWallet = async () => {
    if (!provider) {
      dispatch(connectWalletFailure('No provider available'));
      return;
    }

    try {
      dispatch(connectWalletRequest());
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      // Get the connected chain ID
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      
      dispatch(connectWalletSuccess({ address, chainId }));
    } catch (error) {
      console.error('Error connecting wallet:', error);
      dispatch(connectWalletFailure(error.message || 'Failed to connect wallet'));
    }
  };

  const disconnectWalletHandler = () => {
    dispatch(disconnectWallet());
  };

  const switchNetwork = async (chainId: number) => {
    if (!provider) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  return {
    address,
    isConnected,
    chainId,
    isConnecting,
    error,
    provider,
    connectWallet,
    disconnectWallet: disconnectWalletHandler,
    switchNetwork,
  };
};
