'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/lib/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = connectSocket();
    setSocket(socketInstance);

    const onConnect = () => {
      console.log('✅ Socket connecté');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('❌ Socket déconnecté');
      setIsConnected(false);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      disconnectSocket();
    };
  }, []);

  return { socket, isConnected };
};