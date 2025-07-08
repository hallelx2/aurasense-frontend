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
} from '@chakra-ui/react';
import { Mic, Play, Pause } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
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

export function SessionView({ sessionId, onNewChat }: SessionViewProps) {
  const { data: session } = useSession();
  const { startRecording, stopRecording, isRecording, audioBlob } = useVoiceRecording();
  const { socket, isConnected } = useWebSocket(session?.user?.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'Hey, good day. I want to get dinner from Nigeria and I do not know what to eat tonight or where to get it.',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'agent',
      content: '',
      audioUrl: '/response.wav',
      timestamp: new Date()
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

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
                  {message.audioUrl ? (
                    <HStack spacing={3}>
                      <IconButton
                        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                        icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        size="sm"
                        variant="ghost"
                        color={useColorModeValue('gray.600', 'gray.400')}
                        onClick={() => setIsPlaying(!isPlaying)}
                      />
                      <Box flex={1} h={1} bg={useColorModeValue('gray.200', 'gray.600')} borderRadius="full" />
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>0:15</Text>
                    </HStack>
                  ) : (
                    <Text fontSize="sm">{message.content}</Text>
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
        <MotionIconButton
          aria-label="Record voice"
          icon={<Mic size={20} />}
          size="lg"
          isRound
          colorScheme="primary"
          h="56px"
          w="56px"
          onClick={() => {
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
          animate={{
            scale: isRecording ? [1, 1.2, 1] : 1,
            transition: {
              repeat: isRecording ? Infinity : 0,
              duration: 1.5
            }
          }}
          _hover={{
            transform: 'scale(1.05)'
          }}
          _active={{
            transform: 'scale(0.95)'
          }}
        />
        <Text
          position="absolute"
          bottom={2}
          fontSize="sm"
          color={mutedTextColor}
        >
          {isRecording ? 'Recording...' : 'Press to speak'}
        </Text>
      </Center>
    </Box>
  );
}
