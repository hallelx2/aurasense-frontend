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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react';
import { Settings, User, Bell, HelpCircle, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface DashboardSidebarProps {
  user: Session['user'];
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <Box
      w="full"
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
    >
      <VStack spacing={6} align="stretch">
        {/* User Profile Section */}
        <HStack spacing={3} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
          <Avatar
            name={user.name}
            size="md"
            bg="primary.500"
            color="white"
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm">{user.name}</Text>
            <Text fontSize="xs" color={mutedTextColor}>{user.email}</Text>
          </VStack>
          <Menu>
            <MenuButton as={IconButton} icon={<Settings />} variant="ghost" size="sm" />
            <MenuList>
              <MenuItem icon={<User />}>Profile</MenuItem>
              <MenuItem icon={<Bell />}>Notifications</MenuItem>
              <MenuItem icon={<HelpCircle />}>Help & Support</MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<LogOut />}
                color="red.500"
                onClick={handleSignOut}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </VStack>
    </Box>
  );
}
