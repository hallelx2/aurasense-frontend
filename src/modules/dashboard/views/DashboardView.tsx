"use client";

import {
  Box,
  HStack,
  Text,
  Button,
  Heading,
  useColorModeValue,
  Flex,
  Badge,
  Avatar,
  useToast,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  VStack,
  Center,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { ChefHat, Plane, Users, Shield } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { SessionView } from '../views/SessionView';
import { SessionModal } from '../components/SessionModal';
import { Session } from 'next-auth';

interface DashboardViewProps {
  user: Session['user'];
}

// Agent definitions with Chef as the only functional one
const agents = [
  {
    id: 'chef',
    name: "Chef",
    subtitle: "Food Discovery Agent",
    emoji: "👨‍🍳",
    icon: ChefHat,
    description: "Passionate foodie who knows every restaurant, dietary restriction, and hidden gem in your area.",
    color: "orange.500",
    bgColor: "orange.50",
    capabilities: ["Dietary restrictions", "Menu analysis", "Price optimization", "Order handling"],
    sessionType: "Food Orders",
    isEnabled: true,
    isActive: true,
    comingSoon: false
  },
  {
    id: 'guardian',
    name: "Guardian",
    subtitle: "Health & Safety Agent",
    emoji: "🛡️",
    icon: Shield,
    description: "Medical expert who keeps you safe and ensures all recommendations respect your health.",
    color: "green.500",
    bgColor: "green.50",
    capabilities: ["Health monitoring", "Allergy alerts", "Medical facilities", "Safety protocols"],
    sessionType: "Health Sessions",
    isEnabled: false,
    isActive: false,
    comingSoon: true
  },
  {
    id: 'navigator',
    name: "Navigator",
    subtitle: "Travel Companion Agent",
    emoji: "✈️",
    icon: Plane,
    description: "World traveler who ensures your trips are accessible, comfortable, and memorable.",
    color: "blue.500",
    bgColor: "blue.50",
    capabilities: ["Travel planning", "Accessibility", "Accommodations", "Travel updates"],
    sessionType: "Travel Plans",
    isEnabled: false,
    isActive: false,
    comingSoon: true
  },
  {
    id: 'connector',
    name: "Connector",
    subtitle: "Community Navigator Agent",
    emoji: "🤝",
    icon: Users,
    description: "Social bridge-builder who helps you find your tribe and meaningful connections.",
    color: "purple.500",
    bgColor: "purple.50",
    capabilities: ["Community matching", "Event discovery", "Safe meetups", "Social connections"],
    sessionType: "Community Sessions",
    isEnabled: false,
    isActive: false,
    comingSoon: true
  }
];

interface Session {
    id: string;
    title: string;
    agent: any;
}

export function DashboardView({ user }: DashboardViewProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['chef']);
  const { isOpen: isSessionModalOpen, onOpen: onSessionModalOpen, onClose: onSessionModalClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Load initial session
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, selectedSession]);

  const handleNewSession = () => {
    onSessionModalOpen();
  };

  const handleCreateSession = (sessionData: any) => {
    const agent = agents.find(a => a.id === sessionData.agentId);
    if (!agent) return;

    const newSession: Session = {
      id: `${Date.now()}`,
      title: sessionData.title,
      agent: agent,
    };

    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSession);
    onSessionModalClose();
  };

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  return (
    <Flex minH="100vh" direction="column" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={8}
        py={4}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        borderBottomWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        zIndex={10}
      >
        <HStack spacing={4}>
          <Heading size="md" color="primary.500">Aurasense</Heading>
          <Badge colorScheme="primary" fontSize="0.9em">Voice-First AI</Badge>
        </HStack>

        <HStack spacing={4}>
          {/* Global Search */}
          <InputGroup maxW="300px">
            <InputLeftElement>
              <Icon as={Search} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search everything..."
              bg={useColorModeValue('gray.50', 'gray.700')}
              border="none"
              _focus={{ bg: useColorModeValue('white', 'gray.600') }}
            />
          </InputGroup>

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Icon as={Bell} />
          </Button>

          <Avatar name={user?.name || "User"} src={user?.image || undefined} size="sm" bg="primary.500" color="white" />
        </HStack>
      </Flex>

      <Flex flex={1} overflow="hidden">
        {/* Sidebar */}
        <DashboardSidebar
          agents={agents}
          sessions={sessions}
          selectedSession={selectedSession}
          onSessionSelect={setSelectedSession}
          onNewSession={handleNewSession}
          onAgentToggle={handleAgentToggle}
          selectedAgents={selectedAgents}
        />

        {/* Main Content */}
        <Box flex={1} p={6}>
          {selectedSession ? (
            <SessionView session={selectedSession} />
          ) : (
            <Center h="full">
              <VStack spacing={4}>
                <Heading>No session selected</Heading>
                <Text>Create a new session to get started.</Text>
                <Button colorScheme="primary" onClick={handleNewSession}>
                  New Chat
                </Button>
              </VStack>
            </Center>
          )}
        </Box>
      </Flex>

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={onSessionModalClose}
        agents={agents.filter(a => !a.comingSoon)}
        onCreateSession={handleCreateSession}
        selectedAgents={selectedAgents}
      />
    </Flex>
  );
}