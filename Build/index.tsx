import React from 'react';
import WalletConnect from '../components/wallet/WalletConnect';
import WalletStatus from '../components/wallet/WalletStatus';
import WalletAuthentication from '../components/wallet/WalletAuthentication';
import NFTGallery from '../components/wallet/NFTGallery';
import { Provider } from 'react-redux';
import { store } from '../store';

const HomePage: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Dormlet</h1>
              </div>
              <div>
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Wallet Integration</h2>
                <WalletStatus />
                <WalletAuthentication />
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About Dormlet</h2>
                <p className="text-gray-600">
                  Dormlet is a scroll-core room powered by your wallet. Turn your NFTs into a room you can decorate, then walk around with your avatar and invite friends to hang in it like a coffee shop.
                </p>
                <p className="text-gray-600 mt-4">
                  Think Sims meets TikTok meets Zora, but inside your own space.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <NFTGallery />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default HomePage;
