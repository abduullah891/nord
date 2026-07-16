import { useEffect } from 'react';

export const useAntiInspect = () => {
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    
    const handleKeyDown = (e) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      
      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return;
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
