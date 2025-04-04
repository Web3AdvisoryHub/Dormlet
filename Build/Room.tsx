import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateObjectInSpace } from '../../store/spaceSlice';

// NFT Object component that renders a 3D representation of an NFT
const NFTObject: React.FC<{
  nftId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (position: [number, number, number]) => void;
}> = ({ nftId, position, rotation, scale, imageUrl, isSelected, onClick, onDragEnd }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<THREE.Vector3 | null>(null);
  const { camera, raycaster, mouse, scene } = useThree();
  
  // Create a plane for the NFT with the image as a texture
  const texture = new THREE.TextureLoader().load(imageUrl);
  const material = new THREE.MeshStandardMaterial({ 
    map: texture,
    side: THREE.DoubleSide,
  });

  // Handle click on the NFT
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    onClick();
  };

  // Handle drag start
  const handleDragStart = (e: THREE.Event) => {
    if (isSelected) {
      e.stopPropagation();
      setIsDragging(true);
      setDragStart(mesh.current?.position.clone() || null);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging && mesh.current) {
      setIsDragging(false);
      onDragEnd([
        mesh.current.position.x,
        mesh.current.position.y,
        mesh.current.position.z
      ]);
    }
  };

  // Update position during drag
  useFrame(() => {
    if (isDragging && mesh.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersect = intersects[0];
        mesh.current.position.copy(intersect.point);
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
      onPointerLeave={handleDragEnd}
    >
      <boxGeometry args={[1, 1, 0.05]} />
      <meshStandardMaterial {...material} />
      {isSelected && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.05, 1.05, 0.1)]} />
          <lineBasicMaterial attach="material" color="blue" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

// Room component that renders the 3D space
const Room: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSpace } = useSelector((state: RootState) => state.space);
  const { nfts } = useSelector((state: RootState) => state.nft);
  const [selectedNftId, setSelectedNftId] = useState<string | null>(null);

  // Handle NFT selection
  const handleNftClick = (nftId: string) => {
    setSelectedNftId(nftId === selectedNftId ? null : nftId);
  };

  // Handle NFT drag end
  const handleNftDragEnd = (nftId: string, position: [number, number, number]) => {
    if (currentSpace) {
      const object = currentSpace.objects.find(obj => obj.id === nftId);
      if (object) {
        dispatch(updateObjectInSpace({
          ...object,
          position: { x: position[0], y: position[1], z: position[2] }
        }));
      }
    }
  };

  // If no space is selected, show a placeholder
  if (!currentSpace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select or create a space to view</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        <OrbitControls enableDamping dampingFactor={0.25} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Room environment */}
        <Environment preset="apartment" />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        
        {/* Walls */}
        <mesh position={[0, 1, -5]}>
          <boxGeometry args={[10, 4, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[10, 4, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[5, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[10, 4, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        
        {/* NFT objects */}
        {currentSpace.objects.map((object) => {
          const nft = nfts.find(n => n.id === object.nftId);
          if (!nft) return null;
          
          return (
            <NFTObject
              key={object.id}
              nftId={object.id}
              position={[
                object.position.x,
                object.position.y,
                object.position.z
              ]}
              rotation={[
                object.rotation.x,
                object.rotation.y,
                object.rotation.z
              ]}
              scale={[
                object.scale.x,
                object.scale.y,
                object.scale.z
              ]}
              imageUrl={nft.image}
              isSelected={selectedNftId === object.id}
              onClick={() => handleNftClick(object.id)}
              onDragEnd={(position) => handleNftDragEnd(object.id, position)}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default Room;
