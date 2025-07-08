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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { ChefHat, Plane, Users, Shield } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { SessionsList } from '../components/SessionsList';
import { SessionModal } from '../components/SessionModal';

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

// Order session interface
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

// Mock order sessions
const MOCK_SESSIONS: OrderSession[] = [
  {
    id: '1',
    agentId: 'chef',
    title: 'Italian Dinner Order',
    status: 'completed',
    createdAt: '2024-01-15',
    lastActivity: '2 hours ago',
    summary: 'Ordered pasta primavera from Mario\'s Kitchen',
    orderValue: 28.50,
    location: 'Downtown',
    rating: 5
  },
  {
    id: '2',
    agentId: 'chef',
    title: 'Healthy Lunch Planning',
    status: 'active',
    createdAt: '2024-01-14',
    lastActivity: '30 minutes ago',
    summary: 'Finding gluten-free options for team lunch',
    orderValue: 45.00,
    location: 'Office District'
  },
  {
    id: '3',
    agentId: 'chef',
    title: 'Weekend Brunch',
    status: 'pending',
    createdAt: '2024-01-13',
    lastActivity: '1 day ago',
    summary: 'Planning brunch for 6 people with dietary restrictions',
    location: 'Midtown'
  }
];

export function DashboardView() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['chef']); // Chef is enabled by default
  const [sessions, setSessions] = useState<OrderSession[]>(MOCK_SESSIONS);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isSessionModalOpen, onOpen: onSessionModalOpen, onClose: onSessionModalClose } = useDisclosure();
  const toast = useToast();

  const handleAgentToggle = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);

    if (agent?.comingSoon) {
      toast({
        title: 'Coming Soon!',
        description: `${agent.name} agent will be available in the next update.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const handleNewSession = () => {
    if (selectedAgents.length === 0) {
      toast({
        title: 'Select an agent first',
        description: 'Please select at least one agent to start a new session.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSessionModalOpen();
  };

  const handleCreateSession = (sessionData: any) => {
    const newSession: OrderSession = {
      id: `${Date.now()}`,
      agentId: sessionData.agentId,
      title: sessionData.title,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      summary: sessionData.description || `Starting new session with ${agents.find(a => a.id === sessionData.agentId)?.name}...`
    };

    setSessions(prev => [newSession, ...prev]);
  };

  const handleSessionClick = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      toast({
        title: 'Opening Session',
        description: `Opening "${session.title}" session...`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      // Here you would navigate to the session detail view
    }
  };

  const handleSessionAction = (sessionId: string, action: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    switch (action) {
      case 'resume':
        toast({
          title: 'Resuming Session',
          description: `Resuming "${session.title}"...`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'edit':
        toast({
          title: 'Edit Session',
          description: 'Edit functionality coming soon!',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'share':
        toast({
          title: 'Share Session',
          description: 'Share functionality coming soon!',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'delete':
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        toast({
          title: 'Session Deleted',
          description: `"${session.title}" has been deleted.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        break;
    }
  };

  const activeSessionsCount = sessions.filter(s => s.status === 'active').length;

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

          <Avatar name="User" size="sm" bg="primary.500" color="white" />
        </HStack>
      </Flex>

      <Flex flex={1} overflow="hidden">
        {/* Sidebar */}
        <DashboardSidebar
          agents={agents}
          selectedAgents={selectedAgents}
          onAgentToggle={handleAgentToggle}
          onNewSession={handleNewSession}
          activeSessionsCount={activeSessionsCount}
        />

        {/* Main Content */}
        <SessionsList
          sessions={sessions}
          agents={agents}
          selectedAgents={selectedAgents}
          onSessionClick={handleSessionClick}
          onSessionAction={handleSessionAction}
          onNewSession={handleNewSession}
          isLoading={isLoading}
        />
      </Flex>

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={onSessionModalClose}
        selectedAgents={selectedAgents}
        agents={agents}
        onCreateSession={handleCreateSession}
      />
    </Flex>
  );
}
