import { useEffect, useRef, useState } from 'react';
import { RegisterSWOptions, registerSW } from 'virtual:pwa-register';

const PWARegistration = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  // Store the update function in a ref to avoid re-renders
  const updateSW = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    // The registerSW function returns a function to trigger the update.
    // We store it in our ref.
    updateSW.current = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
      onRegistered(swRegistration) {
        console.log('SW registered: ', swRegistration);
      },
      onRegisterError(error) {
        console.log('SW registration error', error);
      },
    } as RegisterSWOptions);
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const updateServiceWorker = () => {
    // Call the update function stored in the ref.
    // Passing true forces a page reload.
    updateSW.current?.(true);
    close();
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {offlineReady && (
              <svg aria-hidden="true" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {needRefresh && (
              <svg aria-hidden="true" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {offlineReady && 'App ready to work offline'}
              {needRefresh && 'New content available'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {offlineReady && 'Your medicine reminder app is now ready to work offline.'}
              {needRefresh && 'Click reload to update the app with the latest features.'}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={close}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {needRefresh && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={updateServiceWorker}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reload
            </button>
            <button
              onClick={close}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWARegistration; 