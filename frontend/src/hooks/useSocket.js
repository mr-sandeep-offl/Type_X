import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket } from '../socket';

export function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null);
  const handlersRef = useRef(eventHandlers);
  handlersRef.current = eventHandlers;

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    const attached = {};
    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      const wrapper = (...args) => handlersRef.current[event]?.(...args);
      attached[event] = wrapper;
      socket.on(event, wrapper);
    });

    return () => {
      Object.entries(attached).forEach(([event, wrapper]) => {
        socket.off(event, wrapper);
      });
    };
  }, []); // only once

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return { emit, disconnect, socket: socketRef };
}
