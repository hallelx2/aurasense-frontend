"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { VoiceCommand, VoiceResponse } from '@/types/voice';
import { AgentResponse } from '@/types/agent';

interface WebSocketOptions {
  userId?: string;
  sessionId?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onVoiceResponse?: (response: VoiceResponse) => void;
  onAgentResponse?: (response: AgentResponse) => void;
}

interface WebSocketState {
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastError: Error | null;
}

export function useWebSocket(options: WebSocketOptions = {}) {
  const {
    userId,
    sessionId,
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError,
    onVoiceResponse,
    onAgentResponse
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastError: null
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    try {
      const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
        auth: { userId, sessionId },
        transports: ['websocket'],
        reconnection: false // We'll handle reconnection manually
      });

      socket.on('connect', () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isReconnecting: false,
          reconnectAttempts: 0,
          lastError: null
        }));
        onConnect?.();
      });

      socket.on('disconnect', (reason) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          lastError: new Error(`Disconnected: ${reason}`)
        }));
        onDisconnect?.(reason);

        if (autoReconnect && state.reconnectAttempts < maxReconnectAttempts) {
          handleReconnect();
        }
      });

      socket.on('error', (error: Error) => {
        setState(prev => ({
          ...prev,
          lastError: error
        }));
        onError?.(error);
      });

      socket.on('voice:response', (response: VoiceResponse) => {
        onVoiceResponse?.(response);
      });

      socket.on('agent:response', (response: AgentResponse) => {
        onAgentResponse?.(response);
      });

      socketRef.current = socket;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to connect to WebSocket');
      setState(prev => ({
        ...prev,
        lastError: err
      }));
      onError?.(err);
    }
  }, [userId, sessionId, autoReconnect, maxReconnectAttempts, onConnect, onDisconnect, onError, onVoiceResponse, onAgentResponse, state.reconnectAttempts]);

  const handleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isReconnecting: true,
      reconnectAttempts: prev.reconnectAttempts + 1
    }));

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [connect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setState({
      isConnected: false,
      isReconnecting: false,
      reconnectAttempts: 0,
      lastError: null
    });
  }, []);

  const sendVoiceCommand = useCallback((command: VoiceCommand) => {
    if (!socketRef.current?.connected) {
      throw new Error('WebSocket is not connected');
    }
    socketRef.current.emit('voice:command', command);
  }, []);

  // Connect on mount or when userId/sessionId changes
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    socket: socketRef.current,
    sendVoiceCommand,
    disconnect,
    reconnect: connect
  };
}
