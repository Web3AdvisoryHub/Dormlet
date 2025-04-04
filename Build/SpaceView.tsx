import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Room from './Room';
import SpaceControls from './SpaceControls';
import SpaceManager from './SpaceManager';

const SpaceView: React.FC = () => {
  const { currentSpace } = useSelector((state: RootState) => state.space);

  return (
    <div className="space-view grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <SpaceManager />
        <SpaceControls />
      </div>
      <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
        {currentSpace ? (
          <Room />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No space selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new space or select an existing one to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceView;
