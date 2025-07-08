'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Avatar,
  Flex,
  Center,
  Button,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ChefHat,
  Plane,
  Users,
  Heart,
  Shield,
  Brain,
  Zap,
  MessageSquare,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const agents = [
  {
    id: 'chef',
    name: "Chef",
    subtitle: "Food Discovery Agent",
    emoji: "👨‍🍳",
    icon: ChefHat,
    personality: "Passionate foodie who knows every restaurant, dietary restriction, and hidden gem in your area.",
    capabilities: [
      "Understands 50+ dietary restrictions",
      "Real-time menu analysis",
      "Price and nutrition optimization",
      "Handles reservations and orders"
    ],
    specialties: ["Allergies", "Budget-friendly", "Quick delivery"],
    color: "primary.500",
    quote: "\"Let me find you something delicious that's safe for your health needs!\""
  },
  {
    id: 'guardian',
    name: "Guardian",
    subtitle: "Health & Safety Agent",
    emoji: "🛡️",
    icon: Shield,
    personality: "Medical expert who keeps you safe and ensures all recommendations respect your health.",
    capabilities: [
      "Drug interaction checking",
      "Allergy cross-referencing",
      "Medical facility locating",
      "Emergency health protocols"
    ],
    specialties: ["Medication safety", "Allergy alerts", "Emergency care"],
    color: "health.success",
    quote: "\"Your health and safety are my top priority in every recommendation!\""
  },
  {
    id: 'navigator',
    name: "Navigator",
    subtitle: "Travel Companion Agent",
    emoji: "✈️",
    icon: Plane,
    personality: "World traveler who ensures your trips are accessible, comfortable, and memorable.",
    capabilities: [
      "Accessibility-first travel planning",
      "Health-conscious accommodations",
      "Real-time travel updates",
      "Emergency health support abroad"
    ],
    specialties: ["Accessible hotels", "Medical facilities", "Dietary options"],
    color: "secondary.500",
    quote: "\"I'll make sure your journey is smooth and accommodating to all your needs!\""
  },
  {
    id: 'connector',
    name: "Connector",
    subtitle: "Community Navigator Agent",
    emoji: "🤝",
    icon: Users,
    personality: "Social bridge-builder who helps you find your tribe and meaningful connections.",
    capabilities: [
      "Shared interest matching",
      "Local community discovery",
      "Safe meetup coordination",
      "Accessibility-aware events"
    ],
    specialties: ["Support groups", "Hobby clubs", "Health communities"],
    color: "fresh.500",
    quote: "\"Let me connect you with people who truly understand your journey!\""
  },
  {
    id: 'memory',
    name: "Memory",
    subtitle: "Context Management Agent",
    emoji: "🧠",
    icon: Brain,
    personality: "Digital memory keeper who learns your preferences and anticipates your needs.",
    capabilities: [
      "Preference learning and adaptation",
      "Context-aware suggestions",
      "Routine pattern recognition",
      "Proactive recommendations"
    ],
    specialties: ["Personal learning", "Context awareness", "Habit tracking"],
    color: "accent.500",
    quote: "\"I remember what you love so you don't have to repeat yourself!\""
  },
  {
    id: 'orchestrator',
    name: "Orchestrator",
    subtitle: "Coordination Agent",
    emoji: "🎯",
    icon: MessageSquare,
    personality: "Master coordinator who ensures all agents work together seamlessly for you.",
    capabilities: [
      "Multi-agent coordination",
      "Priority management",
      "Conflict resolution",
      "Seamless handoffs"
    ],
    specialties: ["Task coordination", "Priority handling", "Smooth workflows"],
    color: "purple.500",
    quote: "\"I make sure all your agents work together like a perfect team!\""
  }
];

const conversationFlow = [
  {
    step: 1,
    speaker: 'user',
    message: "I need dinner tonight but I'm diabetic and want something healthy",
    emoji: "👤",
    delay: 0
  },
  {
    step: 2,
    speaker: 'orchestrator',
    message: "Got it! Let me coordinate with the team to find the perfect option.",
    emoji: "🎯",
    delay: 1000
  },
  {
    step: 3,
    speaker: 'memory',
    message: "I remember you love Mediterranean food and prefer places under $25",
    emoji: "🧠",
    delay: 2000
  },
  {
    step: 4,
    speaker: 'guardian',
    message: "Checking... Mediterranean is great for diabetics! Low glycemic options available.",
    emoji: "🛡️",
    delay: 3000
  },
  {
    step: 5,
    speaker: 'chef',
    message: "Perfect! I found 3 Mediterranean places with diabetic-friendly menus nearby.",
    emoji: "👨‍🍳",
    delay: 4000
  },
  {
    step: 6,
    speaker: 'navigator',
    message: "The closest one has wheelchair access and parking. 15 minutes away!",
    emoji: "✈️",
    delay: 5000
  },
  {
    step: 7,
    speaker: 'result',
    message: "🎉 Found: Olive Garden Mediterranean - Diabetic-friendly, $22, accessible, 15 min away!",
    emoji: "✨",
    delay: 6000
  }
];

export function AgentTeam() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scatteredCards, setScatteredCards] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        if (currentStep < conversationFlow.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          // Reset after completion
          setTimeout(() => {
            setIsAnimating(false);
            setCurrentStep(0);
            setScatteredCards(false);
          }, 3000);
        }
      }, conversationFlow[currentStep]?.delay || 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep]);

  const startAnimation = () => {
    setScatteredCards(true);
    setIsAnimating(true);
    setCurrentStep(0);
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
  };

  return (
    <Box id="agents" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          {/* Section Header */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            spacing={4}
            textAlign="center"
          >
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Meet Your{' '}
              <Box as="span" color="primary.500">
                AI Dream Team
              </Box>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Six specialized agents working together to understand your unique needs and deliver perfect results.
            </Text>

            {/* Animation Control */}
            <HStack spacing={4} mt={6}>
              <Button
                leftIcon={isAnimating ? <Pause size={16} /> : <Play size={16} />}
                onClick={isAnimating ? pauseAnimation : startAnimation}
                colorScheme="primary"
                size="md"
                isDisabled={isAnimating && currentStep === 0}
              >
                {isAnimating ? 'Pause' : 'Watch Them Work Together'}
              </Button>
            </HStack>
          </MotionVStack>

          {/* Animated Agent Cards */}
          <Box position="relative" w="full" minH="800px">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              w="full"
              position="relative"
            >
              {agents.map((agent, index) => (
                <MotionCard
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  animate={
                    scatteredCards && !isAnimating
                      ? {
                          x: (index % 2 === 0 ? -1 : 1) * (Math.random() * 100 + 50),
                          y: (index % 2 === 0 ? -1 : 1) * (Math.random() * 100 + 50),
                          rotate: (Math.random() - 0.5) * 20,
                          scale: 0.9,
                        }
                      : isAnimating
                      ? { x: 0, y: 0, rotate: 0, scale: 1 }
                      : { x: 0, y: 0, rotate: 0, scale: 1 }
                  }
                  whileHover={
                    !isAnimating
                      ? {
                          scale: 1.05,
                          rotateY: 5,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        }
                      : {}
                  }
                  bg="white"
                  boxShadow="xl"
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px"
                  borderColor="gray.100"
                  h="full"
                  position="relative"
                >
                  <CardBody p={8}>
                    <VStack spacing={6} align="start" h="full">
                      {/* Agent Header */}
                      <HStack spacing={4} w="full">
                        <Center
                          w={16}
                          h={16}
                          bg={`${agent.color.split('.')[0]}.50`}
                          borderRadius="full"
                          fontSize="2xl"
                          position="relative"
                        >
                          {agent.emoji}
                          {/* Speaking Animation */}
                          {isAnimating && conversationFlow[currentStep]?.speaker === agent.id && (
                            <MotionBox
                              position="absolute"
                              top={-2}
                              right={-2}
                              w={6}
                              h={6}
                              bg={agent.color}
                              borderRadius="full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.7, 1],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                              }}
                            />
                          )}
                        </Center>
                        <VStack spacing={1} align="start" flex={1}>
                          <Text fontSize="xl" fontWeight="bold" color="gray.800">
                            {agent.name}
                          </Text>
                          <Text fontSize="sm" color={agent.color} fontWeight="semibold">
                            {agent.subtitle}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Personality - Simplified */}
                      <Text color="gray.600" lineHeight="tall" fontSize="sm">
                        {agent.personality}
                      </Text>

                      {/* Capabilities - Simplified */}
                      <VStack spacing={2} align="start" w="full">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                          SUPERPOWERS:
                        </Text>
                        <VStack spacing={1} align="start" w="full">
                          {agent.capabilities.slice(0, 2).map((capability, idx) => (
                            <HStack key={idx} spacing={2}>
                              <Icon as={Zap} boxSize={3} color={agent.color} />
                              <Text fontSize="xs" color="gray.600">
                                {capability}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>

                      {/* Specialties */}
                      <VStack spacing={3} align="start" w="full">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                          SPECIALIZES IN:
                        </Text>
                        <Flex gap={2} wrap="wrap">
                          {agent.specialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              colorScheme={agent.color.split('.')[0]}
                              variant="subtle"
                              fontSize="xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </Flex>
                      </VStack>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>

            {/* Conversation Flow Overlay */}
            <AnimatePresence>
              {isAnimating && (
                <MotionBox
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  bg="whiteAlpha.950"
                  backdropFilter="blur(10px)"
                  borderRadius="2xl"
                  p={8}
                  maxW="2xl"
                  w="90%"
                  boxShadow="2xl"
                  border="1px"
                  borderColor="gray.200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  zIndex={10}
                >
                  <VStack spacing={6}>
                    <Heading as="h3" size="md" color="gray.800" textAlign="center">
                      🎭 Watch The Magic Happen
                    </Heading>

                    <Box w="full" maxH="400px" overflowY="auto">
                      <VStack spacing={4} align="stretch">
                        {conversationFlow.slice(0, currentStep + 1).map((step, index) => (
                          <MotionBox
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            bg={step.speaker === 'user' ? 'primary.50' :
                                step.speaker === 'result' ? 'green.50' : 'gray.50'}
                            p={4}
                            borderRadius="lg"
                            border="1px"
                            borderColor={step.speaker === 'user' ? 'primary.200' :
                                       step.speaker === 'result' ? 'green.200' : 'gray.200'}
                          >
                            <HStack spacing={3} align="start">
                              <Text fontSize="2xl">{step.emoji}</Text>
                              <VStack spacing={1} align="start" flex={1}>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                  {step.speaker === 'user' ? 'You' :
                                   step.speaker === 'result' ? 'Result' :
                                   agents.find(a => a.id === step.speaker)?.name}
                                </Text>
                                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                                  {step.message}
                                </Text>
                              </VStack>
                            </HStack>
                          </MotionBox>
                        ))}
                      </VStack>
                    </Box>

                    <HStack spacing={4} justify="center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={pauseAnimation}
                      >
                        Pause
                      </Button>
                      <Text fontSize="sm" color="gray.500">
                        Step {currentStep + 1} of {conversationFlow.length}
                      </Text>
                    </HStack>
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          {/* Bottom Message */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            bg="gray.50"
            p={8}
            borderRadius="2xl"
            textAlign="center"
            w="full"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                🤝 They Work Better Together
              </Text>
              <Text fontSize="lg" color={mutedColor} maxW="3xl" lineHeight="tall">
                Each agent brings unique expertise, but the real magic happens when they collaborate.
                Your single voice command triggers a coordinated response that considers your health,
                preferences, accessibility needs, and context all at once.
              </Text>
              <Text fontSize="md" color="primary.600" fontWeight="semibold">
                Click "Watch Them Work Together" to see it in action! 👆
              </Text>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
