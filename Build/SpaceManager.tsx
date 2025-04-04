import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  createSpaceRequest,
  createSpaceSuccess,
  createSpaceFailure,
  setCurrentSpace,
  toggleEditMode
} from '../../store/spaceSlice';
import { v4 as uuidv4 } from 'uuid';

const SpaceManager: React.FC = () => {
  const dispatch = useDispatch();
  const { spaces, currentSpace, isLoading, error, editMode } = useSelector(
    (state: RootState) => state.space
  );
  const { address } = useSelector((state: RootState) => state.wallet);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle space selection
  const handleSpaceSelect = (spaceId: string) => {
    dispatch(setCurrentSpace(spaceId));
  };

  // Handle creating a new space
  const handleCreateSpace = () => {
    if (!newSpaceName.trim() || !address) return;

    dispatch(createSpaceRequest());
    
    // In a real app, this would be an API call
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      try {
        const newSpace = {
          id: uuidv4(),
          name: newSpaceName,
          owner: address,
          isPublic: false,
          template: 'default',
          objects: [],
          environment: {
            skybox: 'default',
            lighting: 'soft',
            ambience: 'quiet'
          }
        };
        
        dispatch(createSpaceSuccess(newSpace));
        setNewSpaceName('');
        setShowCreateForm(false);
      } catch (error) {
        dispatch(createSpaceFailure(error.message));
      }
    }, 500);
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    dispatch(toggleEditMode());
  };

  return (
    <div className="space-manager bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Spaces</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {showCreateForm ? 'Cancel' : 'Create Space'}
        </button>
      </div>
      
      {showCreateForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Space Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="My Awesome Space"
            />
            <button
              onClick={handleCreateSpace}
              disabled={!newSpaceName.trim() || isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
      
      {spaces.length === 0 ? (
        <p className="text-sm text-gray-500">
          You don't have any spaces yet. Create one to get started!
        </p>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 mb-4">
            {spaces.map((space) => (
              <li 
                key={space.id} 
                className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                  currentSpace?.id === space.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSpaceSelect(space.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {space.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {space.objects.length} NFTs
                  </span>
                </div>
              </li>
            ))}
          </ul>
          
          {currentSpace && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-medium">
                {editMode ? 'Edit Mode' : 'View Mode'}
              </span>
              <button
                onClick={handleToggleEditMode}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                  editMode 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-secondary-600 text-white hover:bg-secondary-700'
                }`}
              >
                {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpaceManager;
