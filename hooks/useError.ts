import { useCallback, useEffect } from 'react';
import useNotifications from './useNotifications';
import { generateErrorResponseMessage } from '../utils/httpUtils';

// Fallback needs to be in useCallback or this will render infinitely!
const useError = (error: any, fallback?: () => void) => {
  const { add } = useNotifications();

  const callbackFallback = useCallback(() => {
    if (typeof fallback === 'function') {
      fallback();
    }
  }, [fallback]);

  useEffect(() => {
    if (error) {
      console.log(error.data);
      add({
        type: 'error',
        body: generateErrorResponseMessage(error),
      });

      callbackFallback();
    }
  }, [error, fallback]);

  return null;
};

export default useError;
