/**
 * @fileoverview useApi Custom Hook
 * @description Custom hook for API calls with loading and error states
 * @module hooks/useApi
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for API calls
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Options object
 * @param {boolean} options.showSuccessToast - Show success toast (default: false)
 * @param {boolean} options.showErrorToast - Show error toast (default: true)
 * @returns {Object} { data, loading, error, execute, reset }
 */
const useApi = (apiFunction, options = {}) => {
  const { showSuccessToast = false, showErrorToast = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);

        if (response.status === 'success') {
          setData(response.data);
          if (showSuccessToast && response.message) {
            toast.success(response.message);
          }
          return { success: true, data: response.data };
        }

        throw new Error(response.message || 'Request failed');
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, showErrorToast],
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;

