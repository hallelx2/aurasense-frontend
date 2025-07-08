"use client";

import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { SessionView } from '../views/SessionView';
import { SessionModal } from '../components/SessionModal';
import type { Session } from 'next-auth';

interface DashboardViewProps {
  user: Session['user'];
}

export function DashboardView({ user }: DashboardViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50, fresh.50)',
    'linear(to-br, primary.900, secondary.900, fresh.900)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={8}>
          <GridItem>
            <DashboardSidebar user={user} />
          </GridItem>
          <GridItem>
            <VStack spacing={8} align="stretch">
              <SessionView
                user={user}
                onSessionSelect={() => setIsModalOpen(true)}
              />
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      <SessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}
