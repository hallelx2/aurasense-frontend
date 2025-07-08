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
  Input,
  Textarea,
  Select,
  Avatar,
  Icon,
  useColorModeValue,
  Badge,
  Box,
  Flex,
  Tooltip,
  useToast,
  Spinner,
  Progress,
  Divider,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import {
  Mic,
  MicOff,
  Send,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Settings,
  Zap,
} from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const MotionBox = motion(Box);

interface Agent {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  isEnabled: boolean;
  comingSoon?: boolean;
}

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgents: string[];
  agents: Agent[];
  onCreateSession: (sessionData: any) => void;
}

interface VoiceMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  isProcessing?: boolean;
  audioUrl?: string;
}

export function SessionModal({
  isOpen,
  onClose,
  selectedAgents,
  agents,
  onCreateSession,
}: SessionModalProps) {
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const toast = useToast();
  const { startRecording, stopRecording, isRecording, audioBlob } = useVoiceRecording();

  const enabledAgents = agents.filter(agent => selectedAgents.includes(agent.id) && !agent.comingSoon);

  useEffect(() => {
    if (enabledAgents.length > 0) {
      setSelectedAgentId(enabledAgents[0].id);
    }
  }, [enabledAgents]);

  useEffect(() => {
    if (audioBlob) {
      handleVoiceMessage();
    }
  }, [audioBlob]);

  const handleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
      setIsListening(false);
    } else {
      startRecording();
      setIsListening(true);
      if (!conversationStarted) {
        setConversationStarted(true);
        // Add initial agent greeting
        const agent = agents.find(a => a.id === selectedAgentId);
        if (agent) {
          const greeting: VoiceMessage = {
            id: `${Date.now()}-greeting`,
            type: 'agent',
            content: `Hello! I'm ${agent.name}, your ${agent.subtitle}. How can I help you today?`,
            timestamp: new Date().toISOString(),
          };
          setVoiceMessages([greeting]);
        }
      }
    }
  };

  const handleVoiceMessage = async () => {
    if (!audioBlob) return;

    const userMessage: VoiceMessage = {
      id: `${Date.now()}-user`,
      type: 'user',
      content: 'Processing your voice message...',
      timestamp: new Date().toISOString(),
      isProcessing: true,
    };

    setVoiceMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate voice processing
    setTimeout(() => {
      const processedMessage: VoiceMessage = {
        ...userMessage,
        content: 'I\'d like to order some Italian food for dinner tonight.',
        isProcessing: false,
      };

      const agentResponse: VoiceMessage = {
        id: `${Date.now()}-agent`,
        type: 'agent',
        content: 'Great choice! I can help you find the perfect Italian restaurant. Do you have any dietary restrictions I should know about?',
        timestamp: new Date().toISOString(),
      };

      setVoiceMessages(prev => [
        ...prev.slice(0, -1),
        processedMessage,
        agentResponse,
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleCreateSession = () => {
    if (!selectedAgentId || !sessionTitle.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a session title and select an agent.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const sessionData = {
      title: sessionTitle,
      description: sessionDescription,
      agentId: selectedAgentId,
      messages: voiceMessages,
      createdAt: new Date().toISOString(),
    };

    onCreateSession(sessionData);

    // Reset form
    setSessionTitle('');
    setSessionDescription('');
    setVoiceMessages([]);
    setConversationStarted(false);

    toast({
      title: 'Session Created!',
      description: 'Your new session has been started successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent maxW="800px" maxH="90vh">
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={Zap} color="primary.500" />
            <Text>Start New Session</Text>
            {selectedAgent && (
              <Badge colorScheme="primary" variant="subtle">
                with {selectedAgent.name}
              </Badge>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Session Setup */}
            {!conversationStarted && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Session Title</Text>
                  <Input
                    placeholder="e.g., Dinner Order, Weekend Trip Planning"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Agent Selection</Text>
                  <Select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                  >
                    {enabledAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.subtitle}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Description (Optional)</Text>
                  <Textarea
                    placeholder="Brief description of what you want to accomplish..."
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    rows={3}
                  />
                </Box>

                <Divider />

                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Ready to start? Click the microphone to begin your conversation with {selectedAgent?.name}
                  </Text>
                </Box>
              </VStack>
            )}

            {/* Voice Conversation */}
            {conversationStarted && (
              <Box>
                <HStack justify="space-between" align="center" mb={4}>
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      bg={selectedAgent?.color}
                      color="white"
                      icon={<Icon as={selectedAgent?.icon} />}
                    />
                    <Text fontSize="sm" fontWeight="medium">
                      Conversation with {selectedAgent?.name}
                    </Text>
                  </HStack>
                  <Badge colorScheme={isProcessing ? 'yellow' : 'green'} variant="subtle">
                    {isProcessing ? 'Processing...' : 'Active'}
                  </Badge>
                </HStack>

                {/* Message History */}
                <Box
                  maxH="300px"
                  overflowY="auto"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="md"
                  p={4}
                  mb={4}
                >
                  <VStack spacing={3} align="stretch">
                    {voiceMessages.map((message) => (
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
                              size="xs"
                              bg={selectedAgent?.color}
                              color="white"
                              icon={<Icon as={selectedAgent?.icon} />}
                            />
                          )}
                          <Box
                            bg={message.type === 'user' ? 'primary.500' : 'white'}
                            color={message.type === 'user' ? 'white' : 'gray.800'}
                            p={3}
                            borderRadius="lg"
                            maxW="70%"
                            position="relative"
                          >
                            <Text fontSize="sm">{message.content}</Text>
                            {message.isProcessing && (
                              <HStack spacing={2} mt={2}>
                                <Spinner size="xs" />
                                <Text fontSize="xs" opacity={0.7}>Processing...</Text>
                              </HStack>
                            )}
                          </Box>
                          {message.type === 'user' && (
                            <Avatar size="xs" bg="gray.400" color="white" name="You" />
                          )}
                        </HStack>
                      </MotionBox>
                    ))}
                  </VStack>
                </Box>
              </Box>
            )}

            {/* Voice Controls */}
            <Flex justify="center" align="center">
              <Tooltip label={isListening ? 'Stop recording' : 'Start recording'}>
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
                  isLoading={isProcessing}
                >
                  <UseAnimations
                    animation={microphone}
                    size={24}
                    style={{ color: 'white' }}
                  />
                </Button>
              </Tooltip>
            </Flex>

            {isListening && (
              <Box textAlign="center">
                <Text fontSize="sm" color="primary.500" fontWeight="medium">
                  🎤 Listening... Speak now
                </Text>
                <Progress size="xs" isIndeterminate colorScheme="primary" mt={2} />
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={handleCreateSession}
              isDisabled={!selectedAgentId || !sessionTitle.trim()}
            >
              Create Session
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
