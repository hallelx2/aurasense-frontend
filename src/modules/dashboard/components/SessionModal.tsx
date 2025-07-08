"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Select,
  Textarea,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreate: (sessionId: string) => void;
}

export function SessionModal({ isOpen, onClose, onSessionCreate }: SessionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('chef');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a session in the backend
    const sessionId = Math.random().toString(36).substring(7);
    onSessionCreate(sessionId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
            <Text>Start New Session</Text>
          <Badge colorScheme="primary" ml={2}>WITH CHEF</Badge>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Session Title</FormLabel>
                <Input
                  placeholder="e.g., Dinner Order, Weekend Trip Planning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Agent Selection</FormLabel>
                <Select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="chef">Chef - Food Discovery Agent</option>
                  <option value="guardian" disabled>Guardian - Health & Safety Agent (Soon)</option>
                  <option value="navigator" disabled>Navigator - Travel Companion Agent (Soon)</option>
                  <option value="connector" disabled>Connector - Community Navigator Agent (Soon)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  placeholder="Brief description of what you want to accomplish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </FormControl>

            <Button
              colorScheme="primary"
                type="submit"
                width="full"
                size="lg"
                mt={4}
            >
              Create Session
            </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
