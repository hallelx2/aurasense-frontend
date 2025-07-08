"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Icon,
  useColorModeValue,
  Divider,
  Tooltip,
  Switch,
  FormControl,
  FormLabel,
  Collapse,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Plane,
  Users,
  Shield,
  Settings,
  Calendar,
  Plus,
  ChevronDown,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  HelpCircle,
  Zap,
  Crown,
} from 'lucide-react';

const MotionBox = motion(Box);

interface Agent {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  isEnabled: boolean;
  isActive: boolean;
  comingSoon?: boolean;
}

interface DashboardSidebarProps {
  agents: Agent[];
  selectedAgents: string[];
  onAgentToggle: (agentId: string) => void;
  onNewSession: () => void;
  activeSessionsCount: number;
}

export function DashboardSidebar({
  agents,
  selectedAgents,
  onAgentToggle,
  onNewSession,
  activeSessionsCount,
}: DashboardSidebarProps) {
  const { isOpen: isAgentsOpen, onToggle: onAgentsToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isOrderingsOpen, onToggle: onOrderingsToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isSettingsOpen, onToggle: onSettingsToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      w="320px"
      h="100vh"
      bg={bgColor}
      borderRightWidth={1}
      borderColor={borderColor}
      p={4}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* User Profile Section */}
        <HStack spacing={3} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
          <Avatar name="User" size="md" bg="primary.500" color="white" />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm">John Doe</Text>
            <HStack spacing={1}>
              <Icon as={Crown} size="12px" color="yellow.500" />
              <Text fontSize="xs" color={mutedTextColor}>Pro Member</Text>
            </HStack>
          </VStack>
          <Menu>
            <MenuButton as={IconButton} icon={<Settings />} variant="ghost" size="sm" />
            <MenuList>
              <MenuItem icon={<User />}>Profile</MenuItem>
              <MenuItem icon={<Bell />}>Notifications</MenuItem>
              <MenuItem icon={<HelpCircle />}>Help & Support</MenuItem>
              <MenuDivider />
              <MenuItem icon={<LogOut />} color="red.500">Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* Agents Section */}
        <Box>
          <Button
            variant="ghost"
            onClick={onAgentsToggle}
            leftIcon={<Icon as={isAgentsOpen ? ChevronDown : ChevronRight} />}
            rightIcon={<Badge colorScheme="primary" fontSize="xs">{agents.filter(a => a.isEnabled).length}</Badge>}
            justifyContent="space-between"
            w="full"
            h="auto"
            p={2}
            fontWeight="semibold"
            fontSize="sm"
            color={textColor}
          >
            AI Agents
          </Button>

          <Collapse in={isAgentsOpen} animateOpacity>
            <VStack spacing={2} mt={2} pl={2}>
              {agents.map((agent) => (
                <MotionBox
                  key={agent.id}
                  w="full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HStack
                    p={3}
                    borderRadius="md"
                    bg={agent.isEnabled ? agent.bgColor : 'transparent'}
                    borderWidth={1}
                    borderColor={agent.isEnabled ? agent.color : 'transparent'}
                    opacity={agent.comingSoon ? 0.5 : 1}
                    cursor={agent.comingSoon ? 'not-allowed' : 'pointer'}
                    position="relative"
                    onClick={() => !agent.comingSoon && onAgentToggle(agent.id)}
                  >
                    <Avatar
                      size="sm"
                      bg={agent.color}
                      color="white"
                      icon={<Icon as={agent.icon} />}
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="medium" fontSize="sm">{agent.name}</Text>
                        {agent.comingSoon && (
                          <Badge colorScheme="gray" fontSize="xs">Soon</Badge>
                        )}
                        {agent.isActive && (
                          <Box w={2} h={2} bg="green.500" borderRadius="full" />
                        )}
                      </HStack>
                      <Text fontSize="xs" color={mutedTextColor} noOfLines={1}>
                        {agent.subtitle}
                      </Text>
                    </VStack>
                    <Switch
                      size="sm"
                      isChecked={agent.isEnabled}
                      isDisabled={agent.comingSoon}
                      onChange={() => onAgentToggle(agent.id)}
                      colorScheme="primary"
                    />
                  </HStack>
                </MotionBox>
              ))}
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        {/* Orderings Section */}
        <Box>
          <Button
            variant="ghost"
            onClick={onOrderingsToggle}
            leftIcon={<Icon as={isOrderingsOpen ? ChevronDown : ChevronRight} />}
            rightIcon={<Badge colorScheme="blue" fontSize="xs">{activeSessionsCount}</Badge>}
            justifyContent="space-between"
            w="full"
            h="auto"
            p={2}
            fontWeight="semibold"
            fontSize="sm"
            color={textColor}
          >
            Active Sessions
          </Button>

          <Collapse in={isOrderingsOpen} animateOpacity>
            <VStack spacing={2} mt={2} pl={2}>
              <Button
                leftIcon={<Plus />}
                colorScheme="primary"
                size="sm"
                w="full"
                onClick={onNewSession}
                isDisabled={selectedAgents.length === 0}
              >
                New Session
              </Button>

              {activeSessionsCount > 0 && (
                <Box w="full" p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium">Food Order Session</Text>
                      <Text fontSize="xs" color={mutedTextColor}>with Chef Agent</Text>
                    </VStack>
                    <Box w={2} h={2} bg="green.500" borderRadius="full" />
                  </HStack>
                </Box>
              )}

              <Text fontSize="xs" color={mutedTextColor} textAlign="center" mt={2}>
                {selectedAgents.length === 0
                  ? 'Select agents to start sessions'
                  : `${selectedAgents.length} agent${selectedAgents.length > 1 ? 's' : ''} selected`
                }
              </Text>
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        {/* Settings Section */}
        <Box>
          <Button
            variant="ghost"
            onClick={onSettingsToggle}
            leftIcon={<Icon as={isSettingsOpen ? ChevronDown : ChevronRight} />}
            justifyContent="flex-start"
            w="full"
            h="auto"
            p={2}
            fontWeight="semibold"
            fontSize="sm"
            color={textColor}
          >
            Settings
          </Button>

          <Collapse in={isSettingsOpen} animateOpacity>
            <VStack spacing={3} mt={2} pl={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="dark-mode" mb="0" fontSize="sm" flex={1}>
                  <HStack>
                    <Icon as={Moon} size="16px" />
                    <Text>Dark Mode</Text>
                  </HStack>
                </FormLabel>
                <Switch id="dark-mode" colorScheme="primary" />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="notifications" mb="0" fontSize="sm" flex={1}>
                  <HStack>
                    <Icon as={Bell} size="16px" />
                    <Text>Notifications</Text>
                  </HStack>
                </FormLabel>
                <Switch id="notifications" colorScheme="primary" defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="voice-feedback" mb="0" fontSize="sm" flex={1}>
                  <HStack>
                    <Icon as={Zap} size="16px" />
                    <Text>Voice Feedback</Text>
                  </HStack>
                </FormLabel>
                <Switch id="voice-feedback" colorScheme="primary" defaultChecked />
              </FormControl>
            </VStack>
          </Collapse>
        </Box>

        {/* Upgrade Section */}
        <Box
          p={4}
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          borderRadius="lg"
          color="white"
          textAlign="center"
        >
          <Icon as={Crown} size="24px" mb={2} />
          <Text fontSize="sm" fontWeight="bold" mb={1}>Upgrade to Pro</Text>
          <Text fontSize="xs" opacity={0.8} mb={3}>
            Unlock all agents and premium features
          </Text>
          <Button size="xs" colorScheme="whiteAlpha" variant="solid">
            Upgrade Now
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
