import { Key, useEffect } from "react";

const useKeyboardShortcut = (shortcutKey: String, callback: () => void): void => {
    useEffect(() => {

      const handleKeyPress = (event: KeyboardEvent) => {
        const targetIsInput = event.target instanceof HTMLInputElement;
        const targetIsTextarea = event.target instanceof HTMLTextAreaElement
        
        if (event.key.toLowerCase() === shortcutKey.toLowerCase() && ! targetIsInput && ! targetIsTextarea) {
          callback();
          event.preventDefault()
          event.stopPropagation()
        }
      };
  
      document.addEventListener('keydown', handleKeyPress);
  
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [shortcutKey, callback]);
  };
  
  export default useKeyboardShortcut;