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
  Box,
  Icon,
  useColorModeValue,
  Badge,
  Avatar,
} from '@chakra-ui/react';
import { MessageSquare, Calendar } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const { startRecording, stopRecording, isRecording } = useVoiceRecording();

  const sessions = [
    {
      id: '1',
      title: 'Food Discovery',
      description: 'Find restaurants and order food',
      icon: MessageSquare,
      date: '2024-03-20',
      time: '10:30 AM',
      messages: [
        { id: '1', text: 'Hi, I\'m looking for a restaurant', sender: 'user' },
        { id: '2', text: 'I can help you find the perfect restaurant. What type of cuisine are you interested in?', sender: 'agent' },
      ],
    },
    {
      id: '2',
      title: 'Travel Planning',
      description: 'Plan your next trip',
      icon: Calendar,
      date: '2024-03-19',
      time: '2:45 PM',
      messages: [
        { id: '1', text: 'I want to plan a weekend getaway', sender: 'user' },
        { id: '2', text: 'I\'ll help you plan an amazing trip. Where would you like to go?', sender: 'agent' },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent maxW="800px" maxH="90vh" mx={4}>
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={MessageSquare} color="primary.500" />
            <Text>Session Details</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {sessions.map((session) => (
              <Box
                key={session.id}
                p={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                borderWidth={1}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={4}>
                    <Avatar
                      icon={<Icon as={session.icon} />}
                      bg="primary.500"
                      color="white"
                    />
                    <Box flex={1}>
                      <HStack>
                        <Text fontWeight="bold">{session.title}</Text>
                        <Badge colorScheme="primary">{session.date}</Badge>
                      </HStack>
                      <Text color="gray.500" fontSize="sm">
                        {session.description}
                      </Text>
                    </Box>
                  </HStack>

                  <VStack align="stretch" spacing={3}>
                    {session.messages.map((message) => (
                      <Box
                        key={message.id}
                        bg={message.sender === 'user' ? 'gray.100' : 'primary.50'}
                        p={3}
                        borderRadius="lg"
                      >
                        <Text>{message.text}</Text>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
