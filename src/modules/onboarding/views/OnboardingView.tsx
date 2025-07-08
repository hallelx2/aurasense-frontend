'use client';

import {
  Box,
  VStack,
  Text,
  Button,
  Container,
  Heading,
  useColorModeValue,
  Center,
  Icon,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@chakra-ui/react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4000';

interface AgentMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

interface OnboardingProgress {
  [key: string]: boolean;
}

// Standardized onboarding progress message type
interface OnboardingProgressUpdate {
  type: 'onboarding_progress';
  payload: {
    key: string;
    value: boolean;
  };
}

const ONBOARDING_ITEMS = [
  { key: 'dietaryPreferences', label: 'Dietary Preferences' },
  { key: 'restrictions', label: 'Dietary Restrictions' },
  { key: 'allergies', label: 'Allergies' },
  { key: 'voiceSample', label: 'Voice Sample' },
  { key: 'communityInterests', label: 'Community Interests' },
];

export function OnboardingView() {
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50)',
    'linear(to-br, primary.900, secondary.900)'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress>({});
  const [isListening, setIsListening] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const toast = useToast();
  const router = useRouter();

  // Connect to websocket
  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('agent_message', (msg: AgentMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Standardized onboarding progress update
    socket.on('onboarding_progress', (msg: OnboardingProgressUpdate) => {
      if (msg && msg.type === 'onboarding_progress') {
        setProgress(prev => {
          const updated = { ...prev, [msg.payload.key]: msg.payload.value };
          // If all are true, set onboarding complete
          if (ONBOARDING_ITEMS.every(item => updated[item.key])) {
            setOnboardingComplete(true);
          }
          return updated;
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Redirect when onboarding is complete (mock or real)
  useEffect(() => {
    if (ONBOARDING_ITEMS.every(item => progress[item.key])) {
      if (!onboardingComplete) setOnboardingComplete(true);
    }
    if (onboardingComplete) {
      toast({
        title: 'Onboarding Complete!',
        description: 'Redirecting to your dashboard...'
      });
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  }, [progress, onboardingComplete, router, toast]);

  // Mock agent and progress for demo/testing
  const mockAgentStep = () => {
    // Find the next incomplete item
    const nextItem = ONBOARDING_ITEMS.find(item => !progress[item.key]);
    if (!nextItem) return;
    // Add agent message
    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        sender: 'agent',
        text: `Please provide your ${nextItem.label.toLowerCase()}.`,
        timestamp: new Date().toISOString(),
      },
      {
        id: `${Date.now() + 1}`,
        sender: 'user',
        text: `Here is my ${nextItem.label.toLowerCase()}.`,
        timestamp: new Date().toISOString(),
      },
    ]);
    // Mark as complete (simulate backend WSS message)
    setTimeout(() => {
      setProgress(prev => {
        const updated = { ...prev, [nextItem.key]: true };
        // If all are true, set onboarding complete
        if (ONBOARDING_ITEMS.every(item => updated[item.key])) {
          setOnboardingComplete(true);
        }
        return updated;
      });
    }, 500);
  };

  // Voice icon click handler (mock)
  const handleVoiceInput = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      toast({
        title: 'Listening... Speak now!',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        setIsListening(false);
        mockAgentStep();
      }, 2000);
    } catch (err) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to continue onboarding.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} position="relative" overflow="hidden">
      <Container maxW="container.xl" py={16}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
          {/* Agent Chat */}
          <Box flex={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="2xl" boxShadow="lg" p={8} minH="500px" position="relative">
            <Heading size="lg" mb={6} color="primary.500">Onboarding Assistant</Heading>
            <VStack align="stretch" spacing={4} maxH="60vh" overflowY="auto">
              {messages.length === 0 && (
                <Text color={mutedColor}>The agent will guide you through onboarding. Start by clicking the voice icon below!</Text>
              )}
              {messages.map((msg) => (
                <Box key={msg.id} alignSelf={msg.sender === 'agent' ? 'flex-start' : 'flex-end'}>
                  <Box
                    bg={msg.sender === 'agent' ? 'primary.50' : 'primary.500'}
                    color={msg.sender === 'agent' ? textColor : 'white'}
                    px={4}
                    py={2}
                    borderRadius="xl"
                    boxShadow="sm"
                    maxW="80%"
                  >
                    {msg.text}
                  </Box>
                  <Text fontSize="xs" color={mutedColor} mt={1} textAlign={msg.sender === 'agent' ? 'left' : 'right'}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </Box>
              ))}
            </VStack>
            {/* Microphone icon at the bottom center of chat area */}
            <Center position="absolute" bottom={4} left={0} right={0}>
          <Button
                size="xl"
                bg={isListening ? 'voice.listening' : 'primary.500'}
                color="white"
                borderRadius="full"
                boxShadow="2xl"
                p={6}
                onClick={handleVoiceInput}
                _hover={{ bg: 'primary.600', transform: 'scale(1.05)' }}
                _active={{ transform: 'scale(0.95)' }}
                aria-label="Start voice input"
                isDisabled={isListening || onboardingComplete}
              >
                <UseAnimations
                  animation={microphone}
                  size={48}
                  style={{ color: 'white' }}
                  strokeColor={isListening ? '#FF6B35' : 'white'}
                />
              </Button>
              </Center>
          </Box>

          {/* Collected Info / Progress as checklist */}
          <Box flex={1} bg={useColorModeValue('white', 'gray.800')} borderRadius="2xl" boxShadow="lg" p={8} minH="500px">
            <Heading size="md" mb={4} color="primary.500">Your Progress</Heading>
            <VStack align="stretch" spacing={4}>
              {ONBOARDING_ITEMS.map(item => (
                <HStack key={item.key} spacing={3}>
                  <Box
                    as="span"
                    w={5}
                    h={5}
                    borderRadius="md"
                    borderWidth={2}
                    borderColor={progress[item.key] ? 'green.400' : 'gray.300'}
                    bg={progress[item.key] ? 'green.400' : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {progress[item.key] && (
                      <Icon as={Mic} color="white" w={3} h={3} />
                    )}
                  </Box>
                  <Text color={progress[item.key] ? 'green.600' : mutedColor} fontWeight={progress[item.key] ? 'bold' : 'normal'}>
                    {item.label}
              </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
