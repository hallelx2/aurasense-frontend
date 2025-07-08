"use client"

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Icon,
  useColorModeValue,
  Card,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { HeroSection } from '../components/HeroSection';
import { ScenarioShowcase } from '../components/ScenarioShowcase';
import { HowItWorks } from '../components/HowItWorks';
import { SocialProof } from '../components/SocialProof';
import { PowerFeatures } from '../components/PowerFeatures';
import { AgentTeam } from '../components/AgentTeam';
import { FinalCTA } from '../components/FinalCTA';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionCard = motion(Card);

export function LandingPageView() {
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50, fresh.50)',
    'linear(to-br, primary.900, secondary.900, fresh.900)'
  );

  const handleGetStarted = () => {
    // Navigate to onboarding
    window.location.href = '/onboarding';
  };

  const handleLogin = () => {
    router.push('/auth/signin');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <Navbar onGetStarted={handleGetStarted} onLogin={handleLogin} onSignUp={handleSignUp} />
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      pt="72px" // Add padding top to account for fixed navbar
    >
      {/* Animated Floating Navbar */}


      {/* Hero Section - Powerful Opening */}
      <HeroSection onGetStarted={handleGetStarted} onLearnMore={() => scrollToSection('scenarios')} />

      {/* Scenario Showcase - "Imagine This" */}
      <ScenarioShowcase />

      {/* How It Works - Voice-First Revolution */}
      <Box id="how-it-works">
        <HowItWorks />
      </Box>

      {/* Social Proof - Real Stories */}
      <Box id="community">
        <SocialProof />
      </Box>

      {/* Power Features - What Makes It Special */}
      <Box id="features">
        <PowerFeatures />
      </Box>

      {/* Agent Team - Your AI Companions */}
      <AgentTeam />

      {/* Final Call to Action */}
      <FinalCTA onGetStarted={handleGetStarted} />

      {/* Footer */}
      <Box bg="gray.900" color="white" py={12}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Divider borderColor="gray.700" />
            <HStack spacing={8} wrap="wrap" justify="center">
              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="gray.400">
                  Product
                </Text>
                <VStack spacing={1} align="start" fontSize="sm">
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Voice Interface
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Health Features
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Community
                  </Text>
                </VStack>
              </VStack>

              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="gray.400">
                  Company
                </Text>
                <VStack spacing={1} align="start" fontSize="sm">
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    About
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Careers
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Contact
                  </Text>
                </VStack>
              </VStack>

              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="gray.400">
                  Legal
                </Text>
                <VStack spacing={1} align="start" fontSize="sm">
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Privacy Policy
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Terms of Service
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'primary.300' }}>
                    Accessibility
                  </Text>
                </VStack>
              </VStack>
            </HStack>

            <VStack spacing={4} textAlign="center">
              <Text fontSize="lg" fontWeight="semibold" color="gray.200">
                Aurasense
              </Text>
              <Text fontSize="sm" color="gray.400">
                © 2024 Aurasense. Making lifestyle choices accessible for everyone.
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Box>
    </>
  );
}
