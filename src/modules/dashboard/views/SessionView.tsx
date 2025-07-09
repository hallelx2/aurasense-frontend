"use client";

import {
  Box,
  VStack,
  Text,
  Button,
  Center,
  IconButton,
  useColorModeValue,
  HStack,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { Mic, Play, Pause } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SessionViewProps {
  sessionId: string | null;
  onNewChat: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

export function SessionView({ sessionId, onNewChat }: SessionViewProps) {
  const { data: session } = useSession();
  const { startRecording, stopRecording, isRecording, audioBlob } = useVoiceRecording();
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL && sessionId
    ? `${process.env.NEXT_PUBLIC_WEBSOCKET_URL.replace(/^http/, 'ws')}/ws/session/${sessionId}`
    : null;
  const { socket, isConnected } = useWebSocket(wsUrl);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleVoiceInput = async () => {
    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
      console.log('Recording stopped, audioBlob:', audioBlob);

      if (audioBlob) {
        setIsProcessing(true);
        try {
          console.log('Creating form data...');
          const formData = new FormData();
          formData.append('audio', audioBlob);
          if (session?.user) {
            formData.append('userProfile', JSON.stringify({
              preferences: session.user.preferences,
              healthProfile: session.user.healthProfile
            }));
          }

          console.log('Sending to API...');
          const response = await fetch('/api/voice/transcribe', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Failed to process voice input');
          }

          console.log('Processing API response...');
          const data = await response.json();
          console.log('API response:', data);

          // Add user message
          const userMessageId = crypto.randomUUID();
          setMessages(prev => [...prev, {
            id: userMessageId,
            type: 'user',
            content: data.text,
            timestamp: new Date()
          }]);

          // Add agent message with audio
          const agentMessageId = crypto.randomUUID();
          setMessages(prev => [...prev, {
            id: agentMessageId,
            type: 'agent',
            content: data.response,
            audioUrl: data.audioUrl,
            timestamp: new Date()
          }]);

          // Auto-play agent's response
          if (audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.play();
            setCurrentPlayingId(agentMessageId);
          }
        } catch (error) {
          console.error('Error processing voice:', error);
          toast({
            title: 'Error',
            description: 'Failed to process voice input. Please try again.',
            status: 'error',
            duration: 3000,
          });
        } finally {
          setIsProcessing(false);
        }
      } else {
        console.log('No audioBlob available after stopping recording');
        toast({
          title: 'Recording Error',
          description: 'No audio was captured. Please try again.',
          status: 'warning',
          duration: 3000,
        });
      }
    } else {
      console.log('Starting recording...');
      startRecording();
    }
  };

  const handleAudioPlayback = (messageId: string, audioUrl: string) => {
    if (!audioRef.current) return;

    if (currentPlayingId === messageId) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setCurrentPlayingId(messageId);
    }
  };

  // Empty state when no session is selected
  if (!sessionId) {
    return (
      <Center h="full" p={8}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="semibold">
            No session selected
          </Text>
          <Text color={mutedTextColor}>
            Create a new session to get started.
          </Text>
          <Button
            colorScheme="primary"
            size="lg"
            onClick={onNewChat}
          >
            New Chat
          </Button>
        </VStack>
      </Center>
    );
  }

  // Active session view
  return (
    <Box h="full" bg={bgColor} position="relative">
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={() => setCurrentPlayingId(null)}
        onPause={() => setCurrentPlayingId(null)}
      />

      {/* Session Header */}
      <Box p={4} borderBottom="1px" borderColor={useColorModeValue('gray.100', 'gray.700')}>
        <Text fontSize="xl" fontWeight="semibold">
          Order a dinner
        </Text>
        <Text fontSize="sm" color={mutedTextColor}>
          A conversation with Chef
        </Text>
      </Box>

      {/* Messages Area */}
      <VStack
        spacing={6}
        p={4}
        h="calc(100vh - 180px)"
        overflowY="auto"
        align="stretch"
      >
          {messages.map((message) => (
          <Box
            key={message.id}
            alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
            maxW="70%"
          >
            <HStack spacing={2} align="flex-start">
              {message.type === 'agent' && (
                <Avatar
                  size="xs"
                  name="Chef"
                  bg="primary.500"
                  mt={1}
                />
              )}
              <Box>
                {message.type === 'agent' && (
                  <Text fontSize="xs" color={mutedTextColor} mb={1}>
                    Chef
                  </Text>
                )}
                <Box
                  bg={message.type === 'user' ? 'primary.500' : 'gray.100'}
                  color={message.type === 'user' ? 'white' : 'gray.800'}
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  borderBottomLeftRadius={message.type === 'agent' ? '2px' : undefined}
                  borderBottomRightRadius={message.type === 'user' ? '2px' : undefined}
                >
                  <Text fontSize="sm" mb={message.audioUrl ? 2 : 0}>
                    {message.content}
                  </Text>
                  {message.audioUrl && (
                    <HStack spacing={3} mt={2}>
                      <IconButton
                        aria-label={currentPlayingId === message.id ? 'Pause audio' : 'Play audio'}
                        icon={currentPlayingId === message.id ? <Pause size={16} /> : <Play size={16} />}
                        size="sm"
                        variant="ghost"
                        color={useColorModeValue('gray.600', 'gray.400')}
                        onClick={() => handleAudioPlayback(message.id, message.audioUrl!)}
                      />
                      <Box flex={1} h={1} bg={useColorModeValue('gray.200', 'gray.600')} borderRadius="full" />
                    </HStack>
                  )}
                </Box>
              </Box>
            </HStack>
          </Box>
          ))}
        </VStack>

      {/* Voice Input Area */}
      <Center
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        py={6}
        bg={bgColor}
        borderTop="1px"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
      >
        <MotionBox
          position="relative"
          animate={isProcessing ? {
            scale: [1, 1.1, 1],
            transition: {
              repeat: Infinity,
              duration: 2
            }
          } : {}}
        >
          <MotionIconButton
            aria-label="Record voice"
            icon={<Mic size={20} />}
            size="lg"
            isRound
            colorScheme={isProcessing ? "gray" : "primary"}
            h="56px"
            w="56px"
            onClick={handleVoiceInput}
            isDisabled={isProcessing}
            animate={{
              scale: isRecording ? [1, 1.2, 1] : 1,
              transition: {
                repeat: isRecording ? Infinity : 0,
                duration: 1.5
              }
            }}
            _hover={{
              transform: isProcessing ? 'none' : 'scale(1.05)'
            }}
            _active={{
              transform: isProcessing ? 'none' : 'scale(0.95)'
            }}
          />
          {isProcessing && (
            <MotionBox
              position="absolute"
              top="-2px"
              left="-2px"
              right="-2px"
              bottom="-2px"
            borderRadius="full"
              border="2px solid"
              borderColor="primary.500"
              animate={{
                rotate: 360,
                transition: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear"
                }
              }}
            />
          )}
        </MotionBox>
        <Text
          position="absolute"
          bottom={2}
          fontSize="sm"
          color={mutedTextColor}
          fontWeight={isProcessing ? "medium" : "normal"}
        >
          {isProcessing ? 'Processing...' : isRecording ? 'Press to stop' : 'Press to speak'}
          </Text>
      </Center>
    </Box>
  );
}
