"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  Center,
  Spinner,
  Badge,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { SessionCard } from './SessionCard';

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
  icon: any;
  color: string;
}

interface SessionsListProps {
  sessions: OrderSession[];
  agents: Agent[];
  selectedAgents: string[];
  onSessionClick: (sessionId: string) => void;
  onSessionAction: (sessionId: string, action: string) => void;
  onNewSession: () => void;
  isLoading?: boolean;
}

export function SessionsList({
  sessions,
  agents,
  selectedAgents,
  onSessionClick,
  onSessionAction,
  onNewSession,
  isLoading = false,
}: SessionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const toast = useToast();

  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || session.agentId === agentFilter;
    const matchesSelectedAgents = selectedAgents.length === 0 || selectedAgents.includes(session.agentId);

    return matchesSearch && matchesStatus && matchesAgent && matchesSelectedAgents;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAgentFilter('all');
    setSortBy('recent');
  };

  const getStatusCount = (status: string) => {
    return sessions.filter(s => s.status === status).length;
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box flex={1} p={6} bg={bgColor} minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {selectedAgents.length > 0
              ? `${agents.find(a => selectedAgents.includes(a.id))?.name || 'Selected'} Sessions`
              : 'All Sessions'
            }
          </Text>
          <HStack spacing={4}>
            <Badge colorScheme="blue" variant="subtle">
              <HStack spacing={1}>
                <Icon as={AlertCircle} size="12px" />
                <Text>{getStatusCount('active')} Active</Text>
              </HStack>
            </Badge>
            <Badge colorScheme="green" variant="subtle">
              <HStack spacing={1}>
                <Icon as={CheckCircle} size="12px" />
                <Text>{getStatusCount('completed')} Completed</Text>
              </HStack>
            </Badge>
            <Badge colorScheme="yellow" variant="subtle">
              <HStack spacing={1}>
                <Icon as={Clock} size="12px" />
                <Text>{getStatusCount('pending')} Pending</Text>
              </HStack>
            </Badge>
          </HStack>
        </Box>

        <Button
          leftIcon={<Plus />}
          colorScheme="primary"
          onClick={onNewSession}
          isDisabled={selectedAgents.length === 0}
        >
          New Session
        </Button>
      </Flex>

      {/* Filters */}
      <Box bg={cardBgColor} p={4} borderRadius="lg" mb={6} boxShadow="sm">
        <VStack spacing={4}>
          <HStack spacing={4} w="full">
            <InputGroup flex={1}>
              <InputLeftElement>
                <Icon as={Search} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              maxW="150px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </Select>

            <Select
              maxW="150px"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="all">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </Select>

            <Select
              maxW="150px"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="status">Status</option>
            </Select>

            <Button
              variant="outline"
              leftIcon={<Filter />}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </HStack>

          <HStack spacing={2} fontSize="sm" color="gray.500">
            <Text>Showing {sortedSessions.length} of {sessions.length} sessions</Text>
            {selectedAgents.length > 0 && (
              <Text>• Filtered by selected agents</Text>
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Sessions List */}
      {isLoading ? (
        <Center h="400px">
          <VStack spacing={4}>
            <Spinner size="lg" color="primary.500" />
            <Text color="gray.500">Loading sessions...</Text>
          </VStack>
        </Center>
      ) : sortedSessions.length === 0 ? (
        <Center h="400px">
          <VStack spacing={4}>
            <Icon as={MessageCircle} size="48px" color="gray.400" />
            <Text color="gray.500" textAlign="center" fontSize="lg">
              {sessions.length === 0
                ? 'No sessions yet'
                : 'No sessions match your filters'
              }
            </Text>
            <Text color="gray.400" textAlign="center" fontSize="sm">
              {selectedAgents.length === 0
                ? 'Select agents from the sidebar to start creating sessions'
                : 'Start a new session to begin your conversation'
              }
            </Text>
            {selectedAgents.length > 0 && (
              <Button colorScheme="primary" onClick={onNewSession}>
                Start New Session
              </Button>
            )}
          </VStack>
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {sortedSessions.map((session) => {
            const agent = agents.find(a => a.id === session.agentId);
            if (!agent) return null;

            return (
              <SessionCard
                key={session.id}
                session={session}
                agent={agent}
                onSessionClick={onSessionClick}
                onSessionAction={onSessionAction}
              />
            );
          })}
        </VStack>
      )}
    </Box>
  );
}
