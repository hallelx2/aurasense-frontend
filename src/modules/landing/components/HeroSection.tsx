'use client';

import {
  Box,
  VStack,
  Text,
  Button,
  Container,
  Heading,
  HStack,
  useColorModeValue,
  Center,
  Badge,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { ArrowRight, Volume2, Heart, Zap, Users } from 'lucide-react';
import { useState } from 'react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import activity from 'react-useanimations/lib/activity';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const pulseSlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.6; }
`;

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  const [isListening, setIsListening] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const toast = useToast();

  const handleVoiceDemo = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      toast({
        title: 'Microphone Access Granted',
        description: 'You can now use voice features!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to use voice features.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setShowResponse(true);
      setTimeout(() => {
        setShowResponse(false);
      }, 4000);
    }, 2500);
  };

  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50, fresh.50)',
    'linear(to-br, primary.900, secondary.900, fresh.900)'
  );

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      position="relative"
      display="flex"
      alignItems="center"
      overflow="hidden"
    >
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16} textAlign="center">
          {/* Attention Grabber */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            spacing={2}
          >
            <Badge
              colorScheme="primary"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
            >
              🎙️ The Future of Accessible Technology
            </Badge>
          </MotionVStack>

          {/* Main Headline */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            spacing={6}
          >
            <MotionHeading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '8xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
              maxW="5xl"
            >
              Stop{' '}
              <Box as="span" color="primary.500">
                Searching.
              </Box>
              <br />
              Start{' '}
              <Box as="span" className="gradient-text">
                Speaking.
              </Box>
            </MotionHeading>

            <MotionText
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
              color={mutedColor}
              maxW="4xl"
              lineHeight="tall"
              fontWeight="medium"
            >
              Aurasense understands what you need before you finish asking.
              <br />
              Find food, plan travel, connect with community—all through voice.
            </MotionText>
          </MotionVStack>

          {/* Interactive Voice Demo */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={mutedColor}
                  fontWeight="semibold"
                >
                  Try it now: "I need gluten-free sushi for tonight"
                </Text>

                <Button
                  size="xl"
                  variant={isListening ? "recording" : "voice"}
                  onClick={handleVoiceDemo}
                  aria-label="Try voice demo"
                  isDisabled={isListening || showResponse}
                  w={24}
                  h={24}
                  borderRadius="full"
                >
                  <UseAnimations
                    animation={isListening ? activity : microphone}
                    size={60}
                    style={{ color: 'white' }}
                  />
                </Button>

                {/* Listening State */}
                {isListening && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VStack spacing={2}>
                      <Text color="primary.600" fontWeight="semibold">
                        Listening...
                      </Text>
                      <HStack spacing={1} className="waveform">
                        <Box className="waveform-bar" />
                        <Box className="waveform-bar" />
                        <Box className="waveform-bar" />
                        <Box className="waveform-bar" />
                        <Box className="waveform-bar" />
                      </HStack>
                    </VStack>
                  </MotionBox>
                )}

                {/* Response */}
                {showResponse && (
                  <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="white"
                    p={6}
                    borderRadius="2xl"
                    boxShadow="xl"
                    maxW="lg"
                    border="2px"
                    borderColor="primary.100"
                  >
                    <VStack spacing={3} align="start">
                      <Text color="primary.600" fontSize="sm" fontWeight="bold">
                        AURASENSE FOUND:
                      </Text>
                      <Text color="gray.800" fontSize="lg" lineHeight="tall">
                        "Perfect! I found <strong>Sakura Sushi</strong> 0.3 miles away.
                        They have a dedicated gluten-free menu and are open until 10 PM.
                        Their rainbow roll is amazing! Should I make a reservation?"
                      </Text>
                      <Flex gap={2} mt={2}>
                        <Badge colorScheme="green">Gluten-Free Menu</Badge>
                        <Badge colorScheme="blue">Open Now</Badge>
                        <Badge colorScheme="purple">Highly Rated</Badge>
                      </Flex>
                    </VStack>
                  </MotionBox>
                )}
              </VStack>
            </VStack>
          </MotionBox>

          {/* Social Proof */}
          <MotionVStack
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            spacing={4}
          >
            <HStack spacing={8} wrap="wrap" justify="center" fontSize="sm" color={mutedColor}>
              <HStack>
                <Heart size={16} fill="currentColor" />
                <Text>Health-First</Text>
              </HStack>
              <HStack>
                <Zap size={16} />
                <Text>Instant Results</Text>
              </HStack>
              <HStack>
                <Users size={16} />
                <Text>Community Driven</Text>
              </HStack>
            </HStack>

            <Text fontSize="sm" color={mutedColor}>
              Trusted by <strong>10,000+</strong> users who value accessibility and health
            </Text>
          </MotionVStack>

          {/* Action Buttons */}
          <MotionVStack
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            spacing={4}
          >
            <HStack spacing={4} wrap="wrap" justify="center">
              <Button
                size="lg"
                variant="solid"
                rightIcon={<ArrowRight />}
                onClick={onGetStarted}
                _hover={{ transform: 'translateY(-2px)' }}
                px={8}
                py={6}
                fontSize="lg"
              >
                Start Speaking Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                colorScheme="primary"
                leftIcon={<Volume2 />}
                onClick={onLearnMore}
                _hover={{ transform: 'translateY(-2px)' }}
                px={8}
                py={6}
                fontSize="lg"
              >
                See It In Action
              </Button>
            </HStack>

            <Text fontSize="xs" color={mutedColor}>
              No downloads • No setup • Works everywhere
            </Text>
          </MotionVStack>
        </VStack>
      </Container>

      {/* Background Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        opacity={0.6}
      >
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="400px"
          h="400px"
          bg="primary.300"
          borderRadius="full"
          filter="blur(100px)"
          animation={`${pulseSlow} 4s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          w="300px"
          h="300px"
          bg="secondary.300"
          borderRadius="full"
          filter="blur(80px)"
          animation={`${pulseSlow} 4s ease-in-out infinite`}
          style={{ animationDelay: '2s' }}
        />
        <Box
          position="absolute"
          top="60%"
          left="50%"
          transform="translateX(-50%)"
          w="200px"
          h="200px"
          bg="fresh.300"
          borderRadius="full"
          filter="blur(60px)"
          animation={`${pulseSlow} 4s ease-in-out infinite`}
          style={{ animationDelay: '4s' }}
        />
      </Box>
    </Box>
  );
}
