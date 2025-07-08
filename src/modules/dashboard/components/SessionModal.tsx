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
  const toast = useToast();

  useEffect(() => {
    if (selectedAgents.length > 0) {
      setSelectedAgentId(selectedAgents[0]);
    }
  }, [selectedAgents]);

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
      createdAt: new Date().toISOString(),
    };

    onCreateSession(sessionData);

    // Reset form
    setSessionTitle('');
    setSessionDescription('');

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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent maxW="800px" maxH="90vh" mx={4}>
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
                  {agents.map((agent) => (
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
            </VStack>
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
