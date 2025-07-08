"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Icon,
  useColorModeValue,
  IconButton,
  Switch,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import { Settings, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useState } from 'react';

interface DashboardSidebarProps {
  user: Session['user'];
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function DashboardSidebar({ user, onSessionSelect, onNewChat }: DashboardSidebarProps) {
  const [isSessionsOpen, setIsSessionsOpen] = useState(true);
  const [isAgentsOpen, setIsAgentsOpen] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Mock sessions data
  const sessions = [
    {
      id: '1',
      title: 'Order a dinner',
      subtitle: 'with Chef',
      agent: 'Chef'
    }
  ];

  // Mock agents data
  const agents = [
    {
      id: 'chef',
      name: 'Chef',
      subtitle: 'Food Discovery Agent',
      color: 'orange.400',
      isActive: true,
      isSoon: false
    },
    {
      id: 'guardian',
      name: 'Guardian',
      subtitle: 'Health & Safety Agent',
      color: 'green.400',
      isActive: false,
      isSoon: true
    },
    {
      id: 'navigator',
      name: 'Navigator',
      subtitle: 'Travel Companion Agent',
      color: 'blue.400',
      isActive: false,
      isSoon: true
    },
    {
      id: 'connector',
      name: 'Connector',
      subtitle: 'Community Navigator Agent',
      color: 'purple.400',
      isActive: false,
      isSoon: true
    }
  ];

  return (
    <VStack h="full" spacing={4} align="stretch" p={3}>
      {/* User Profile */}
      <HStack spacing={3} px={1}>
        <Avatar
          name={user.name}
          bg="primary.500"
          color="white"
          size="sm"
        />
        <Box flex={1}>
          <Text fontWeight="medium" fontSize="sm">{user.name}</Text>
          <Text fontSize="xs" color={mutedTextColor}>Pro Member</Text>
        </Box>
        <IconButton
          aria-label="Settings"
          icon={<Settings size={18} />}
          variant="ghost"
          size="sm"
        />
      </HStack>

      {/* New Chat Button */}
      <Button
        leftIcon={<Plus size={18} />}
        colorScheme="primary"
        variant="solid"
        onClick={onNewChat}
        size="md"
        h="40px"
      >
        New Chat
      </Button>

      {/* Sessions Section */}
      <Box>
        <HStack
          justify="space-between"
          mb={1}
          px={1}
          cursor="pointer"
          onClick={() => setIsSessionsOpen(!isSessionsOpen)}
        >
          <HStack spacing={1}>
            <Icon as={isSessionsOpen ? ChevronDown : ChevronRight} size={14} />
            <Text fontSize="sm" fontWeight="medium">Sessions</Text>
          </HStack>
          <Badge fontSize="xs">{sessions.length}</Badge>
        </HStack>
        <Collapse in={isSessionsOpen}>
          <VStack align="stretch" spacing={0.5}>
            {sessions.map(session => (
              <Button
                key={session.id}
                variant="ghost"
                justifyContent="flex-start"
                h="auto"
                py={2}
                px={2}
                onClick={() => onSessionSelect(session.id)}
                _hover={{ bg: hoverBg }}
              >
                <HStack spacing={2}>
                  <Avatar size="xs" name={session.agent} bg="primary.500" />
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">{session.title}</Text>
                    <Text fontSize="xs" color={mutedTextColor}>{session.subtitle}</Text>
                  </Box>
                </HStack>
              </Button>
            ))}
          </VStack>
        </Collapse>
      </Box>

      {/* AI Agents Section */}
      <Box>
        <HStack
          justify="space-between"
          mb={1}
          px={1}
          cursor="pointer"
          onClick={() => setIsAgentsOpen(!isAgentsOpen)}
        >
          <HStack spacing={1}>
            <Icon as={isAgentsOpen ? ChevronDown : ChevronRight} size={14} />
            <Text fontSize="sm" fontWeight="medium">AI Agents</Text>
          </HStack>
          <Badge fontSize="xs">1</Badge>
        </HStack>
        <Collapse in={isAgentsOpen}>
          <VStack align="stretch" spacing={0.5}>
            {agents.map(agent => (
              <HStack
                key={agent.id}
                p={2}
                borderRadius="md"
                _hover={{ bg: hoverBg }}
                justify="space-between"
              >
                <HStack spacing={2}>
                  <Avatar size="xs" name={agent.name} bg={agent.color} />
                  <Box>
                    <HStack spacing={1} align="center">
                      <Text fontSize="sm" fontWeight="medium">{agent.name}</Text>
                      {agent.isSoon && (
                        <Badge variant="subtle" colorScheme="gray" fontSize="xs">SOON</Badge>
                      )}
                    </HStack>
                    <Text fontSize="xs" color={mutedTextColor}>{agent.subtitle}</Text>
                  </Box>
                </HStack>
                <Switch
                  size="sm"
                  isChecked={agent.isActive}
                  isDisabled={agent.isSoon}
                  colorScheme="primary"
                />
              </HStack>
            ))}
          </VStack>
        </Collapse>
      </Box>
    </VStack>
  );
}
