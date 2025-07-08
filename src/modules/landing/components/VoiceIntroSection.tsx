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
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowRight, Volume2, Heart } from 'lucide-react';
import { useState } from 'react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import activity from 'react-useanimations/lib/activity';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

interface VoiceIntroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function VoiceIntroSection({ onGetStarted, onLearnMore }: VoiceIntroSectionProps) {
  const [isListening, setIsListening] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
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
      setShowTranscript(true);
      setTimeout(() => {
        setIsListening(false);
        setShowTranscript(false);
      }, 3000);
    }, 2000);
  };

  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box minH="100vh" position="relative" display="flex" alignItems="center">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12} textAlign="center">
          {/* Main Heading */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            spacing={6}
          >
            <MotionHeading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
              maxW="4xl"
            >
              Speak Your{' '}
              <Box as="span" className="gradient-text">
                Lifestyle
              </Box>
            </MotionHeading>

            <MotionText
              fontSize={{ base: 'xl', md: '2xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Discover food, travel, and community through the power of your voice.
              Aurasense makes lifestyle choices accessible, safe, and personal.
            </MotionText>
          </MotionVStack>

          {/* Voice Demo Section */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <VStack spacing={6}>
              <Text fontSize="lg" color={mutedColor} fontWeight="semibold">
                Try saying: "Find me a healthy restaurant nearby"
              </Text>

              <Button
                size="xl"
                variant={isListening ? "recording" : "voice"}
                onClick={handleVoiceDemo}
                aria-label="Try voice demo"
                isDisabled={isListening}
              >
                <UseAnimations
                  animation={isListening ? activity : microphone}
                  size={48}
                  style={{ color: 'white' }}
                />
              </Button>

              {/* Custom Waveform Animation */}
              {isListening && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="waveform"
                >
                  <HStack spacing={1}>
                    <Box className="waveform-bar" />
                    <Box className="waveform-bar" />
                    <Box className="waveform-bar" />
                    <Box className="waveform-bar" />
                    <Box className="waveform-bar" />
                  </HStack>
                </MotionBox>
              )}

              {showTranscript && (
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  boxShadow="lg"
                  maxW="md"
                >
                  <Text color="gray.800" fontSize="lg">
                    "I found 3 healthy restaurants within 0.5 miles.
                    Green Garden Bistro has excellent reviews for their
                    gluten-free options. Would you like me to check their menu?"
                  </Text>
                </MotionBox>
              )}
            </VStack>
          </MotionBox>

          {/* Action Buttons */}
          <MotionVStack
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            spacing={4}
          >
            <HStack spacing={4} wrap="wrap" justify="center">
              <Button
                size="lg"
                variant="solid"
                rightIcon={<ArrowRight />}
                onClick={onGetStarted}
                _hover={{ transform: 'translateY(-2px)' }}
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                colorScheme="primary"
                leftIcon={<Volume2 />}
                onClick={onLearnMore}
                _hover={{ transform: 'translateY(-2px)' }}
              >
                Learn More
              </Button>
            </HStack>

            <HStack spacing={6} fontSize="sm" color={mutedColor}>
              <HStack>
                <Heart size={16} />
                <Text>Health-Aware</Text>
              </HStack>
              <Text>•</Text>
              <HStack>
                <Volume2 size={16} />
                <Text>Voice-First</Text>
              </HStack>
              <Text>•</Text>
              <Text>Accessibility-Focused</Text>
            </HStack>
          </MotionVStack>
        </VStack>
      </Container>

      {/* Background Elements */}
      <Box position="relative" w="full" h="full">
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="200px"
          h="200px"
          bg="primary.400"
          borderRadius="full"
          filter="blur(80px)"
          animation="pulse-slow"
          style={{ animationDelay: '0.5s' }}
        />
        <Box
          position="absolute"
          bottom="20%"
          right="10%"
          w="250px"
          h="250px"
          bg="secondary.400"
          borderRadius="full"
          filter="blur(80px)"
          animation="pulse-slow"
          style={{ animationDelay: '1s' }}
        />
      </Box>
    </Box>
  );
}
