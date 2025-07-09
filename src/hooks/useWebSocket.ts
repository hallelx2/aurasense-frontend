"use client";
import { useEffect, useState, useRef, useCallback } from 'react';

interface WebSocketHook {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: MessageEvent | null;
  sendMessage: (message: string) => void;
  reconnect: () => void;
}

export function useWebSocket(url: string | null, authToken?: string | null): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const errorLoggedRef = useRef(false);

  const connect = useCallback(() => {
    if (!url || isConnectingRef.current) return;

    // Clear existing connection
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    isConnectingRef.current = true;
    errorLoggedRef.current = false;

    const ws = new WebSocket(url);
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
      isConnectingRef.current = false;
      console.log('WebSocket connected successfully');
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      isConnectingRef.current = false;
      console.log('WebSocket closed:', event.code, event.reason);
      
      // Only auto-reconnect if it was an unexpected close
      if (event.code !== 1000 && event.code !== 1001 && url) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    ws.onmessage = (event) => {
      setLastMessage(event);
    };

    ws.onerror = (error) => {
      if (!errorLoggedRef.current) {
        console.error('WebSocket error. State:', ws.readyState, 'URL:', url);
        errorLoggedRef.current = true;
      }
      setIsConnected(false);
      isConnectingRef.current = false;
    };
  }, [url]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    connect();
  }, [connect]);

  useEffect(() => {
    if (!url) {
      setIsConnected(false);
      setSocket(null);
      return;
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [url, connect]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }, []);

  return { socket, isConnected, lastMessage, sendMessage, reconnect };
}
