"use client";

import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Avatar,
  Icon,
  useColorModeValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
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
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Share,
} from 'lucide-react';

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
  icon: any;
  color: string;
}

interface SessionCardProps {
  session: OrderSession;
  agent: Agent;
  onSessionClick: (sessionId: string) => void;
  onSessionAction: (sessionId: string, action: string) => void;
}

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

export function SessionCard({ session, agent, onSessionClick, onSessionAction }: SessionCardProps) {
  const StatusIcon = getStatusIcon(session.status);
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <MotionBox
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        p={4}
        bg={bgColor}
        borderRadius="lg"
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        cursor="pointer"
        onClick={() => onSessionClick(session.id)}
        _hover={{
          bg: hoverBgColor,
          borderColor: agent.color,
          shadow: 'md',
        }}
        transition="all 0.2s"
      >
        <HStack justify="space-between" align="start" spacing={4}>
          {/* Session Info */}
          <HStack spacing={3} flex={1}>
            <Avatar
              size="md"
              bg={agent.color}
              color="white"
              icon={<Icon as={agent.icon} />}
            />

            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2} align="center">
                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                  {session.title}
                </Text>
                {session.status === 'active' && (
                  <Box w={2} h={2} bg="green.500" borderRadius="full" />
                )}
              </HStack>

              <Text fontSize="xs" color="gray.500">
                with {agent.name} • {session.lastActivity}
              </Text>

              {session.summary && (
                <Text fontSize="xs" color="gray.600" noOfLines={2} mt={1}>
                  {session.summary}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Status and Actions */}
          <VStack align="end" spacing={2}>
            <HStack spacing={2}>
              <Badge colorScheme={getStatusColor(session.status)} variant="subtle">
                <HStack spacing={1}>
                  <Icon as={StatusIcon} size="12px" />
                  <Text fontSize="xs">{session.status}</Text>
                </HStack>
              </Badge>

              {session.rating && (
                <HStack spacing={1}>
                  <Icon as={Star} size="12px" color="yellow.400" />
                  <Text fontSize="xs">{session.rating}</Text>
                </HStack>
              )}
            </HStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreVertical />}
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList>
                <MenuItem
                  icon={<Play />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionAction(session.id, 'resume');
                  }}
                >
                  Resume Session
                </MenuItem>
                <MenuItem
                  icon={<Edit />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionAction(session.id, 'edit');
                  }}
                >
                  Edit Details
                </MenuItem>
                <MenuItem
                  icon={<Share />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionAction(session.id, 'share');
                  }}
                >
                  Share Session
                </MenuItem>
                <MenuItem
                  icon={<Trash2 />}
                  color="red.500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionAction(session.id, 'delete');
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </VStack>
        </HStack>

        {/* Session Metadata */}
        <HStack spacing={4} mt={3} fontSize="xs" color="gray.500">
          {session.orderValue && (
            <HStack spacing={1}>
              <Icon as={DollarSign} size="12px" />
              <Text>${session.orderValue}</Text>
            </HStack>
          )}
          {session.location && (
            <HStack spacing={1}>
              <Icon as={MapPin} size="12px" />
              <Text>{session.location}</Text>
            </HStack>
          )}
          <HStack spacing={1}>
            <Icon as={Calendar} size="12px" />
            <Text>{session.createdAt}</Text>
          </HStack>
        </HStack>
      </Box>
    </MotionBox>
  );
}
