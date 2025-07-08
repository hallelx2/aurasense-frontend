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
import { useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface AgentMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

interface OnboardingProgress {
  [key: string]: boolean;
}

const ONBOARDING_ITEMS = [
  {
    key: 'dietaryPreferences',
    label: 'Dietary Preferences',
    agentPrompt: "Hi! Let's start with your dietary preferences. Do you follow any specific diet like vegetarian, vegan, or keto?",
    simulatedResponse: "I prefer a balanced diet with lots of vegetables and lean proteins.",
  },
  {
    key: 'restrictions',
    label: 'Dietary Restrictions',
    agentPrompt: "Great! Now, do you have any dietary restrictions we should know about?",
    simulatedResponse: "Yes, I'm lactose intolerant and try to avoid dairy products.",
  },
  {
    key: 'allergies',
    label: 'Allergies',
    agentPrompt: "Important to know about allergies. Do you have any food allergies?",
    simulatedResponse: "I'm allergic to peanuts and shellfish.",
  },
  {
    key: 'voiceSample',
    label: 'Voice Sample',
    agentPrompt: "I'll need a voice sample to better understand you. Could you say a few sentences about your favorite food?",
    simulatedResponse: "I love Italian cuisine, especially homemade pasta with fresh tomato sauce and basil.",
  },
  {
    key: 'communityInterests',
    label: 'Community Interests',
    agentPrompt: "Finally, what kind of food communities would you like to join?",
    simulatedResponse: "I'm interested in healthy cooking, meal prep, and learning about different cuisines.",
  },
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
  const [currentStep, setCurrentStep] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  // Start the conversation when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const firstItem = ONBOARDING_ITEMS[0];
      setMessages([{
        id: Date.now().toString(),
        sender: 'agent',
        text: firstItem.agentPrompt,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [messages.length]);

  // Handle completion and redirect
  useEffect(() => {
    if (onboardingComplete) {
      const completeOnboarding = async () => {
        try {
          const response = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (data.status === 'error') {
            throw new Error(data.message);
          }

          // Update the session to reflect onboarded status
          await updateSession();

          toast({
            title: 'Welcome to Aurasense!',
            description: 'Your preferences have been saved. Redirecting to dashboard...',
            status: 'success',
            duration: 3000,
          });

          // Give time for the toast to be seen
          setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
          console.error('Error completing onboarding:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          // Reset onboarding complete flag so user can try again
          setOnboardingComplete(false);
        }
      };

      completeOnboarding();
    }
  }, [onboardingComplete, router, toast, updateSession]);

  // Simulate voice input and response
  const simulateConversation = async () => {
    const currentItem = ONBOARDING_ITEMS[currentStep];
    if (!currentItem) return;

    // Simulate user speaking
    setIsListening(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsListening(false);

    // Add user's simulated response
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: currentItem.simulatedResponse,
        timestamp: new Date().toISOString(),
      }
    ]);

    // Mark current step as complete
    setProgress(prev => ({
      ...prev,
      [currentItem.key]: true
    }));

    // Move to next step
    if (currentStep < ONBOARDING_ITEMS.length - 1) {
      const nextItem = ONBOARDING_ITEMS[currentStep + 1];
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'agent',
            text: nextItem.agentPrompt,
            timestamp: new Date().toISOString(),
          }
        ]);
        setCurrentStep(currentStep + 1);
      }, 1000);
    } else {
      // All steps complete
      setOnboardingComplete(true);
    }
  };

  const handleVoiceInput = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      simulateConversation();
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

          {/* Progress Checklist */}
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
                  <Text color={textColor}>{item.label}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
