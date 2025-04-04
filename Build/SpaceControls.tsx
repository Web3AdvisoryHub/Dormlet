import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  addObjectToSpace, 
  removeObjectFromSpace, 
  updateObjectInSpace 
} from '../../store/spaceSlice';
import { v4 as uuidv4 } from 'uuid';

const SpaceControls: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSpace, editMode } = useSelector((state: RootState) => state.space);
  const { nfts } = useSelector((state: RootState) => state.nft);
  const [selectedNftId, setSelectedNftId] = useState<string | null>(null);

  // If no space is selected, show a placeholder
  if (!currentSpace) {
    return null;
  }

  // Handle adding an NFT to the space
  const handleAddNft = () => {
    if (!selectedNftId) return;
    
    const objectId = uuidv4();
    dispatch(addObjectToSpace({
      id: objectId,
      nftId: selectedNftId,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    }));
    
    setSelectedNftId(null);
  };

  // Handle removing an NFT from the space
  const handleRemoveNft = (objectId: string) => {
    dispatch(removeObjectFromSpace(objectId));
  };

  return (
    <div className="space-controls bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">Space Controls</h3>
      
      {editMode ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add NFT to Space
            </label>
            <div className="flex space-x-2">
              <select
                value={selectedNftId || ''}
                onChange={(e) => setSelectedNftId(e.target.value || null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select an NFT</option>
                {nfts.map((nft) => (
                  <option key={nft.id} value={nft.id}>
                    {nft.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddNft}
                disabled={!selectedNftId}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">NFTs in Space</h4>
            {currentSpace.objects.length === 0 ? (
              <p className="text-sm text-gray-500">No NFTs in this space yet</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {currentSpace.objects.map((object) => {
                  const nft = nfts.find(n => n.id === object.nftId);
                  return (
                    <li key={object.id} className="py-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {nft?.name || 'Unknown NFT'}
                      </span>
                      <button
                        onClick={() => handleRemoveNft(object.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Enable edit mode to add or remove NFTs from this space.
        </p>
      )}
    </div>
  );
};

export default SpaceControls;
