import { useContext, useEffect } from 'react';
import { SocketContext } from '../providers/SocketProvider';

/**
 * Custom hook to consume Socket.io instances
 * @param {string} eventName - Optional event to subscribe to
 * @param {function} callback - Callback function triggered upon event arrival
 */
export const useSocket = (eventName, callback) => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  const { socket, connected } = context;

  useEffect(() => {
    if (!socket || !eventName || !callback) return;

    // Attach event listener
    socket.on(eventName, callback);

    // Detach event listener on cleanup unmount
    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);

  return {
    socket,
    connected
  };
};
export default useSocket;
