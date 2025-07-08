"use client";

import { useState } from 'react';
import { Box, Grid, GridItem, useColorModeValue, HStack, Text, Input, IconButton, Button } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { SessionView } from './SessionView';
import { SessionModal } from '../components/SessionModal';
import { Search, Bell } from 'lucide-react';

export function DashboardView() {
  const { data: session } = useSession();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!session?.user) {
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        h="56px"
        bg="white"
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={10}
      >
        <HStack h="full" px={4} justify="space-between" align="center" spacing={4}>
          <HStack spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color="primary.500">Aurasense</Text>
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
            >
              VOICE-FIRST AI
            </Text>
          </HStack>
          <HStack spacing={3}>
            <Box position="relative" w="280px">
              <Input
                placeholder="Search everything..."
                pl={3}
                pr={8}
                h="32px"
                fontSize="sm"
                bg={useColorModeValue('gray.50', 'gray.800')}
                border="none"
                _placeholder={{ color: 'gray.400' }}
                _focus={{
                  boxShadow: 'none',
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              />
              <IconButton
                aria-label="Search"
                icon={<Search size={16} />}
                position="absolute"
                right={1}
                top="50%"
                transform="translateY(-50%)"
                variant="ghost"
                color="gray.400"
                size="xs"
                _hover={{ bg: 'transparent', color: 'gray.600' }}
              />
            </Box>
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                icon={<Bell size={18} />}
                variant="ghost"
                color="gray.600"
                size="sm"
                _hover={{ bg: 'gray.50' }}
              />
              <Box
                position="absolute"
                top={1}
                right={1}
                w={2}
                h={2}
                bg="primary.500"
                borderRadius="full"
              />
            </Box>
            <Button
              size="sm"
              colorScheme="primary"
              borderRadius="full"
              fontSize="sm"
              px={4}
            >
              HQ
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Main Layout */}
      <Box
        position="fixed"
        top="56px"
        bottom={0}
        left={0}
        right={0}
        display="flex"
      >
        {/* Sidebar */}
        <Box
          w="260px"
          h="full"
          borderRight="1px"
          borderColor={borderColor}
          bg={useColorModeValue('white', 'gray.800')}
          flexShrink={0}
        >
          <DashboardSidebar
            user={session.user}
            onSessionSelect={setActiveSessionId}
            onNewChat={() => setIsNewSessionModalOpen(true)}
          />
        </Box>

        {/* Main Content Area */}
        <Box flex={1}>
          <SessionView
            sessionId={activeSessionId}
            onNewChat={() => setIsNewSessionModalOpen(true)}
          />
        </Box>
      </Box>

      {/* New Session Modal */}
      <SessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onSessionCreate={(sessionId) => {
          setActiveSessionId(sessionId);
          setIsNewSessionModalOpen(false);
        }}
      />
    </Box>
  );
}
