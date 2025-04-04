import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentSpace } from '../../store/spaceSlice';

const ScrollCore: React.FC = () => {
  const dispatch = useDispatch();
  const { spaces, currentSpace } = useSelector((state: RootState) => state.space);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spacesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    spacesRef.current = spacesRef.current.slice(0, spaces.length);
  }, [spaces.length]);

  // Handle scroll event to detect current space
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const scrollPosition = scrollContainerRef.current.scrollTop;
    const containerHeight = scrollContainerRef.current.clientHeight;
    
    // Find which space is most visible in the viewport
    let maxVisibleSpace = null;
    let maxVisibleArea = 0;
    
    spacesRef.current.forEach((spaceRef, index) => {
      if (!spaceRef) return;
      
      const rect = spaceRef.getBoundingClientRect();
      const spaceTop = rect.top;
      const spaceBottom = rect.bottom;
      
      // Calculate how much of the space is visible
      const visibleTop = Math.max(0, spaceTop);
      const visibleBottom = Math.min(containerHeight, spaceBottom);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);
      
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        maxVisibleSpace = spaces[index];
      }
    });
    
    // Update current space if needed
    if (maxVisibleSpace && (!currentSpace || maxVisibleSpace.id !== currentSpace.id)) {
      dispatch(setCurrentSpace(maxVisibleSpace.id));
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [spaces]);

  // Scroll to current space when it changes
  useEffect(() => {
    if (currentSpace && scrollContainerRef.current) {
      const index = spaces.findIndex(space => space.id === currentSpace.id);
      if (index !== -1 && spacesRef.current[index]) {
        spacesRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentSpace?.id]);

  return (
    <div 
      ref={scrollContainerRef}
      className="scroll-core h-full overflow-y-auto snap-y snap-mandatory"
    >
      {spaces.map((space, index) => (
        <div
          key={space.id}
          ref={el => spacesRef.current[index] = el}
          className="h-full w-full snap-start snap-always"
          onClick={() => dispatch(setCurrentSpace(space.id))}
        >
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-white p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {space.objects.length} NFTs displayed
              </p>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '400px', width: '100%' }}>
                {/* Preview of the space */}
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">
                    {currentSpace?.id === space.id ? 'Currently Viewing' : 'Click to View'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {spaces.length === 0 && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No spaces found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first space to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollCore;
