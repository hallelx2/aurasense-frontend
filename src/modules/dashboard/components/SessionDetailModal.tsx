"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Icon,
  useColorModeValue,
  Badge,
  Box,
  Flex,
  Divider,
  Progress,
  Tooltip,
  Input,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Play,
  Pause,
  MessageCircle,
  User,
} from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';

const MotionBox = motion(Box);

interface OrderSession {
  id: string;
  agentId: string;
  title: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  lastActivity: string;
  summary?: string;
  orderValue?: number;
  location?: string;
  rating?: number;
}

interface Agent {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
}

interface VoiceMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
}

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: OrderSession | null;
  agent: Agent | null;
  onSessionAction: (sessionId: string, action: string) => void;
}

// Mock conversation history
const getMockConversation = (sessionId: string): VoiceMessage[] => {
  switch (sessionId) {
    case '1':
      return [
        {
          id: '1-1',
          type: 'agent',
          content: 'Hello! I\'m Chef, your Food Discovery Agent. How can I help you today?',
          timestamp: '2024-01-15T18:30:00Z',
        },
        {
          id: '1-2',
          type: 'user',
          content: 'I\'d like to order some Italian food for dinner tonight.',
          timestamp: '2024-01-15T18:30:30Z',
        },
        {
          id: '1-3',
          type: 'agent',
          content: 'Great choice! I can help you find the perfect Italian restaurant. Do you have any dietary restrictions I should know about?',
          timestamp: '2024-01-15T18:31:00Z',
        },
        {
          id: '1-4',
          type: 'user',
          content: 'I\'m vegetarian and prefer gluten-free options.',
          timestamp: '2024-01-15T18:31:45Z',
        },
        {
          id: '1-5',
          type: 'agent',
          content: 'Perfect! I found Mario\'s Kitchen which has excellent vegetarian and gluten-free pasta options. They have a 4.8 rating and are only 15 minutes away. Would you like me to show you their menu?',
          timestamp: '2024-01-15T18:32:15Z',
        },
        {
          id: '1-6',
          type: 'user',
          content: 'Yes, please show me their gluten-free pasta options.',
          timestamp: '2024-01-15T18:32:45Z',
        },
        {
          id: '1-7',
          type: 'agent',
          content: 'Here are their gluten-free options: Pasta Primavera ($18.50), Mushroom Risotto ($22.00), and Margherita Pizza ($16.00). I recommend the Pasta Primavera - it\'s their signature dish!',
          timestamp: '2024-01-15T18:33:00Z',
        },
      ];
    case '2':
      return [
        {
          id: '2-1',
          type: 'agent',
          content: 'Hi! I\'m here to help you plan healthy lunch options. What are you looking for?',
          timestamp: '2024-01-14T12:00:00Z',
        },
        {
          id: '2-2',
          type: 'user',
          content: 'I need to order lunch for my team of 8 people. We need gluten-free options.',
          timestamp: '2024-01-14T12:00:30Z',
        },
        {
          id: '2-3',
          type: 'agent',
          content: 'Excellent! I\'ll help you find a restaurant that can accommodate your team with great gluten-free options. What\'s your budget range per person?',
          timestamp: '2024-01-14T12:01:00Z',
        },
      ];
    case '3':
      return [
        {
          id: '3-1',
          type: 'agent',
          content: 'Hello! Ready to plan an amazing brunch? Tell me about your group.',
          timestamp: '2024-01-13T10:00:00Z',
        },
        {
          id: '3-2',
          type: 'user',
          content: 'I\'m planning brunch for 6 people this weekend. We have some dietary restrictions to consider.',
          timestamp: '2024-01-13T10:00:45Z',
        },
      ];
    default:
      return [];
  }
};

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'green';
    case 'active': return 'blue';
    case 'pending': return 'yellow';
    default: return 'gray';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'active': return AlertCircle;
    case 'pending': return Clock;
    default: return Clock;
  }
}

export function SessionDetailModal({
  isOpen,
  onClose,
  session,
  agent,
  onSessionAction,
}: SessionDetailModalProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>(session ? getMockConversation(session.id) : []);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const { startRecording, stopRecording, isRecording, audioBlob } = useVoiceRecording();

  // Reset messages and mode when session changes
  React.useEffect(() => {
    setMessages(session ? getMockConversation(session.id) : []);
    setVoiceMode(true);
    setIsListening(false);
  }, [session]);

  // Keyboard shortcut: Press 'S' to stop recording
  React.useEffect(() => {
    if (voiceMode && isRecording) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 's') {
          stopRecording();
          setIsListening(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [voiceMode, isRecording, stopRecording]);

  React.useEffect(() => {
    if (audioBlob && voiceMode) {
      handleVoiceSend(audioBlob);
    }
    // eslint-disable-next-line
  }, [audioBlob]);

  // Release microphone when modal closes
  React.useEffect(() => {
    if (!isOpen && isRecording) {
      stopRecording();
      setIsListening(false);
    }
  }, [isOpen, isRecording, stopRecording]);

  if (!session || !agent) return null;

  const StatusIcon = getStatusIcon(session.status);
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const handleAction = (action: string) => {
    if (action === 'resume') {
      setVoiceMode(true);
      return;
    }
    onSessionAction(session.id, action);
    if (action === 'resume') {
      onClose(); // Close modal when resuming (if not voice mode)
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: VoiceMessage = {
      id: `${Date.now()}-user`,
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);
    setTimeout(() => {
      const agentMsg: VoiceMessage = {
        id: `${Date.now()}-agent`,
        type: 'agent',
        content: 'This is a mock agent reply. (Replace with backend integration)',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsSending(false);
    }, 1000);
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
      setIsListening(false);
    } else {
      startRecording();
      setIsListening(true);
    }
  };

  const handleVoiceSend = (audioBlob: Blob) => {
    const userMsg: VoiceMessage = {
      id: `${Date.now()}-user-voice`,
      type: 'user',
      content: '[Voice message sent]',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);
    setTimeout(() => {
      const agentMsg: VoiceMessage = {
        id: `${Date.now()}-agent-voice`,
        type: 'agent',
        content: '[Mock agent voice reply]',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsSending(false);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent maxW="900px" maxH="90vh">
        <ModalHeader>
          <HStack spacing={4}>
            <Avatar
              size="md"
              bg={agent.color}
              color="white"
              icon={<Icon as={agent.icon} />}
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">{session.title}</Text>
              <HStack spacing={3}>
                <Badge colorScheme={getStatusColor(session.status)} variant="subtle">
                  <HStack spacing={1}>
                    <Icon as={StatusIcon} size="12px" />
                    <Text>{session.status}</Text>
                  </HStack>
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  with {agent.name} • {session.lastActivity}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Session Overview */}
            <Box p={4} bg={bgColor} borderRadius="lg">
              <Text fontWeight="medium" mb={3}>Session Overview</Text>
              <VStack spacing={2} align="stretch">
                {session.summary && (
                  <Text fontSize="sm" color="gray.600">{session.summary}</Text>
                )}
                <HStack spacing={6} fontSize="sm">
                  <HStack spacing={1}>
                    <Icon as={Calendar} size="14px" color="gray.400" />
                    <Text>Created: {session.createdAt}</Text>
                  </HStack>
                  {session.location && (
                    <HStack spacing={1}>
                      <Icon as={MapPin} size="14px" color="gray.400" />
                      <Text>{session.location}</Text>
                    </HStack>
                  )}
                  {session.orderValue && (
                    <HStack spacing={1}>
                      <Icon as={DollarSign} size="14px" color="gray.400" />
                      <Text>${session.orderValue}</Text>
                    </HStack>
                  )}
                  {session.rating && (
                    <HStack spacing={1}>
                      <Icon as={Star} size="14px" color="yellow.400" />
                      <Text>{session.rating}/5</Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Box>

            {/* Conversation History */}
            <Box>
              <HStack justify="space-between" align="center" mb={4}>
                <Text fontWeight="medium">Conversation History</Text>
                <Badge colorScheme="blue" variant="outline">
                  {messages.length} messages
                </Badge>
              </HStack>

              <Box
                maxH="400px"
                overflowY="auto"
                bg={bgColor}
                borderRadius="lg"
                p={4}
              >
                <VStack spacing={4} align="stretch">
                  {messages.length === 0 ? (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No conversation history available
                    </Text>
                  ) : (
                    messages.map((message) => (
                      <MotionBox
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HStack
                          align="start"
                          spacing={3}
                          justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
                        >
                          {message.type === 'agent' && (
                            <Avatar
                              size="sm"
                              bg={agent.color}
                              color="white"
                              icon={<Icon as={agent.icon} />}
                            />
                          )}
                          <Box
                            bg={message.type === 'user' ? 'primary.500' : 'white'}
                            color={message.type === 'user' ? 'white' : 'gray.800'}
                            p={3}
                            borderRadius="lg"
                            maxW="70%"
                            boxShadow="sm"
                          >
                            <Text fontSize="sm">{message.content}</Text>
                            <Text
                              fontSize="xs"
                              opacity={0.7}
                              mt={1}
                              textAlign={message.type === 'user' ? 'right' : 'left'}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </Text>
                          </Box>
                          {message.type === 'user' && (
                            <Avatar size="sm" bg="gray.400" color="white" icon={<Icon as={User} />} />
                          )}
                        </HStack>
                      </MotionBox>
                    ))
                  )}
                </VStack>
              </Box>
            </Box>

            {/* Progress Indicator for Active Sessions */}
            {session.status === 'active' && (
              <Box p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderColor="blue.500">
                <HStack spacing={3} mb={2}>
                  <Icon as={AlertCircle} color="blue.500" />
                  <Text fontWeight="medium" color="blue.700">Session in Progress</Text>
                </HStack>
                <Text fontSize="sm" color="blue.600" mb={3}>
                  This session is currently active. You can resume the conversation or let it continue.
                </Text>
                <Progress colorScheme="blue" size="sm" isIndeterminate />
              </Box>
            )}
          </VStack>
        </ModalBody>

        {/* Message Input */}
        {!voiceMode ? (
          <Box px={6} py={4} borderTopWidth={1} borderColor={bgColor} bg={useColorModeValue('white', 'gray.800')}>
            <HStack as="form" onSubmit={e => { e.preventDefault(); handleSend(); }} spacing={2}>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="full"
                px={6}
                py={4}
                fontSize="md"
                _focus={{ borderColor: 'primary.500' }}
                autoComplete="off"
                isDisabled={isSending}
              />
              <Button
                colorScheme="primary"
                type="submit"
                borderRadius="full"
                isLoading={isSending}
                isDisabled={!input.trim() || isSending}
              >
                Send
              </Button>
            </HStack>
          </Box>
        ) : (
          <Box px={6} py={4} borderTopWidth={1} borderColor={bgColor} bg={useColorModeValue('white', 'gray.800')} textAlign="center">
            <Text fontSize="sm" color="gray.600" mb={2}>Voice Mode: Record your message</Text>
            <Button
              size="lg"
              bg={isListening ? 'red.500' : 'primary.500'}
              color="white"
              borderRadius="full"
              w="60px"
              h="60px"
              onClick={handleVoiceRecording}
              _hover={{ transform: 'scale(1.05)' }}
              _active={{ transform: 'scale(0.95)' }}
              isLoading={isRecording}
              mb={2}
            >
              <UseAnimations
                animation={microphone}
                size={24}
                style={{ color: 'white' }}
              />
            </Button>
            {isListening && (
              <Text fontSize="sm" color="primary.500" fontWeight="medium" mt={2}>
                🎤 Listening... Speak now
              </Text>
            )}
            <Button
              mt={4}
              size="sm"
              variant="outline"
              onClick={() => setVoiceMode(false)}
              isDisabled={isRecording}
            >
              Switch to Text
            </Button>
          </Box>
        )}

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {session.status === 'active' && (
              <Button
                colorScheme="blue"
                leftIcon={<Play />}
                onClick={() => handleAction('resume')}
                isDisabled={voiceMode}
              >
                Resume Session
              </Button>
            )}
            {session.status === 'pending' && (
              <Button
                colorScheme="green"
                leftIcon={<Play />}
                onClick={() => handleAction('resume')}
              >
                Start Session
              </Button>
            )}
            <Button
              variant="outline"
              leftIcon={<MessageCircle />}
              onClick={() => handleAction('edit')}
            >
              Edit Details
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
