import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Layout from '../components/core/Layout';
import Room from '../components/space/Room';
import SpaceControls from '../components/space/SpaceControls';
import SpaceManager from '../components/space/SpaceManager';
import Chat from '../components/social/Chat';
import UserList from '../components/social/UserList';

const DormletDemo: React.FC = () => {
  return (
    <Provider store={store}>
      <Layout>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dormlet Demo</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="prose max-w-none">
                <p>
                  This is a complete demo of the Dormlet application. Connect your wallet to get started!
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your NFT Space</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <SpaceManager />
                <SpaceControls />
                <UserList />
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
                  <Room />
                </div>
                <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '300px' }}>
                  <Chat />
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </Provider>
  );
};

export default DormletDemo;
