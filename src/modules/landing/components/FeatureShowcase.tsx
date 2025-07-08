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
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Mic,
  Heart,
  Users,
  Shield,
  Utensils,
  Plane,
  Accessibility,
  Volume2,
  MessageSquare,
  Clock,
  MapPin,
  ChefHat
} from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import heart from 'react-useanimations/lib/heart';
import activity from 'react-useanimations/lib/activity';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const features = [
  {
    icon: Mic,
    animation: microphone,
    title: "Voice-First Interface",
    description: "Simply speak your needs. No complex menus or endless scrolling. Just natural conversation.",
    color: "primary.500",
    badge: "Core Feature"
  },
  {
    icon: Heart,
    animation: heart,
    title: "Health-Aware Recommendations",
    description: "We understand your dietary restrictions, allergies, and health goals. Every suggestion is safe for you.",
    color: "health.success",
    badge: "Health & Safety"
  },
  {
    icon: Accessibility,
    animation: activity,
    title: "Accessibility-First Design",
    description: "Built for everyone. Screen reader compatible, voice-controlled, and motor-accessibility focused.",
    color: "secondary.500",
    badge: "Accessibility"
  },
  {
    icon: Users,
    title: "Community Connection",
    description: "Connect with people who share your lifestyle needs and discover new experiences together.",
    color: "fresh.500",
    badge: "Community"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your health data and preferences are encrypted and secure. You control what you share.",
    color: "earth.500",
    badge: "Privacy"
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Live restaurant availability, travel updates, and community events delivered instantly.",
    color: "accent.500",
    badge: "Real-Time"
  }
];

const agents = [
  {
    icon: ChefHat,
    title: "Food Discovery Agent",
    description: "Finds restaurants that match your taste, budget, and health requirements. Handles ordering and reservations.",
    color: "primary.500"
  },
  {
    icon: Plane,
    title: "Travel Companion Agent",
    description: "Plans accessible trips, finds accommodations, and handles booking with your preferences in mind.",
    color: "secondary.500"
  },
  {
    icon: MessageSquare,
    title: "Community Navigator Agent",
    description: "Connects you with like-minded individuals and local events that match your interests.",
    color: "fresh.500"
  }
];

export function FeatureShowcase() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="features" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          {/* Features Section */}
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
              Why Aurasense?
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Experience the future of lifestyle technology with features designed for accessibility, health, and community.
            </Text>
          </MotionVStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <MotionCard
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s ease"
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Flex justify="space-between" align="start" w="full">
                      <Box
                        w={12}
                        h={12}
                        bg={`${feature.color.split('.')[0]}.50`}
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {feature.animation ? (
                          <UseAnimations
                            animation={feature.animation}
                            size={32}
                            style={{ color: feature.color }}
                          />
                        ) : (
                          <Icon as={feature.icon} boxSize={8} color={feature.color} />
                        )}
                      </Box>
                      <Badge colorScheme={feature.color.split('.')[0]} variant="subtle">
                        {feature.badge}
                      </Badge>
                    </Flex>

                    <VStack spacing={2} align="start">
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {feature.title}
                      </Text>
                      <Text color={mutedColor} lineHeight="tall">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Agents Section */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            spacing={4}
            textAlign="center"
            mt={16}
          >
            <Heading
              as="h3"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Meet Your AI Agents
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Specialized AI agents that understand your unique needs and preferences.
            </Text>
          </MotionVStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            {agents.map((agent, index) => (
              <MotionCard
                key={agent.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                bg="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.3s ease"
              >
                <CardBody p={6} textAlign="center">
                  <VStack spacing={4}>
                    <Box
                      w={16}
                      h={16}
                      bg={`${agent.color.split('.')[0]}.50`}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={agent.icon} boxSize={8} color={agent.color} />
                    </Box>

                    <VStack spacing={2}>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {agent.title}
                      </Text>
                      <Text color={mutedColor} lineHeight="tall">
                        {agent.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
