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
} from '@chakra-ui/react';
import { motion, Transition } from 'framer-motion';
import {
  Clock,
  MapPin,
  Users,
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const cardTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
};

const scenarios = [
  {
    persona: "Sarah",
    avatar: "👩‍🦯",
    situation: "Vision-impaired professional",
    problem: "It's 7 PM, I'm hungry, but navigating food delivery apps with a screen reader is exhausting.",
    solution: "\"Hey Aurasense, I need dinner that's vegetarian and quick.\"",
    result: "Found 3 nearby options with detailed audio descriptions, placed order in 30 seconds.",
    time: "30 seconds",
    satisfaction: "Perfect",
    tags: ["Accessibility", "Quick"],
    color: "primary"
  },
  {
    persona: "Marcus",
    avatar: "👨‍💼",
    situation: "Diabetic business traveler",
    problem: "In a new city, need to find food that won't spike my blood sugar, but don't know the area.",
    solution: "\"Find me low-carb restaurants within walking distance.\"",
    result: "Discovered a hidden gem with sugar-free options, got walking directions with health tips.",
    time: "45 seconds",
    satisfaction: "Life-changing",
    tags: ["Health-Aware", "Travel"],
    color: "secondary"
  },
  {
    persona: "Elena",
    avatar: "👩‍🎓",
    situation: "Student with food allergies",
    problem: "Severe nut allergy, scared to try new restaurants, want to connect with others who understand.",
    solution: "\"Help me find nut-free dining and connect with allergy community.\"",
    result: "Found safe restaurants AND connected with local allergy support group.",
    time: "1 minute",
    satisfaction: "Finally safe",
    tags: ["Community", "Safety"],
    color: "fresh"
  }
];

export function ScenarioShowcase() {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="scenarios" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          {/* Section Header */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={cardTransition}
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
              Real People. Real Moments.
              <br />
              <Box as="span" color="primary.500">Real Solutions.</Box>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              See how Aurasense transforms everyday challenges into simple conversations.
            </Text>
          </MotionVStack>

          {/* Scenario Cards */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} w="full">
            {scenarios.map((scenario, index) => (
              <MotionCard
                key={scenario.persona}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  ...cardTransition,
                  delay: index * 0.2
                }}
                viewport={{ once: true }}
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl'
                }}
                style={{ transition: 'all 0.3s ease' }}
                border="1px"
                borderColor="gray.100"
              >
                <CardBody p={8}>
                  <VStack spacing={6} align="start" h="full">
                    {/* Person */}
                    <HStack spacing={4}>
                      <Text fontSize="3xl">{scenario.avatar}</Text>
                      <VStack spacing={1} align="start">
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                          {scenario.persona}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {scenario.situation}
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Problem */}
                    <VStack spacing={3} align="start">
                      <HStack>
                        <Icon as={AlertTriangle} color="red.500" boxSize={5} />
                        <Text fontSize="sm" fontWeight="semibold" color="red.600">
                          THE PROBLEM
                        </Text>
                      </HStack>
                      <Text color="gray.600" lineHeight="tall" fontSize="sm">
                        "{scenario.problem}"
                      </Text>
                    </VStack>

                    {/* Solution */}
                    <VStack spacing={3} align="start">
                      <HStack>
                        <Icon as={ArrowRight} color="primary.500" boxSize={5} />
                        <Text fontSize="sm" fontWeight="semibold" color="primary.600">
                          AURASENSE SOLUTION
                        </Text>
                      </HStack>
                      <Box
                        bg="primary.50"
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor="primary.200"
                      >
                        <Text color="primary.800" fontSize="md" fontStyle="italic">
                          {scenario.solution}
                        </Text>
                      </Box>
                    </VStack>

                    {/* Result */}
                    <VStack spacing={3} align="start" flex={1}>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" boxSize={5} />
                        <Text fontSize="sm" fontWeight="semibold" color="green.600">
                          THE RESULT
                        </Text>
                      </HStack>
                      <Text color="gray.700" lineHeight="tall" fontSize="sm">
                        {scenario.result}
                      </Text>
                    </VStack>

                    {/* Stats & Tags */}
                    <VStack spacing={4} align="start" w="full">
                      <HStack spacing={6} w="full" justify="space-between">
                        <VStack spacing={1} align="start">
                          <Text fontSize="xs" color="gray.500">Time Saved</Text>
                          <Text fontSize="lg" fontWeight="bold" color={`${scenario.color}.600`}>
                            {scenario.time}
                          </Text>
                        </VStack>
                        <VStack spacing={1} align="end">
                          <Text fontSize="xs" color="gray.500">Satisfaction</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {scenario.satisfaction}
                          </Text>
                        </VStack>
                      </HStack>

                      <Flex gap={2} wrap="wrap">
                        {scenario.tags.map((tag) => (
                          <Badge
                            key={tag}
                            colorScheme={scenario.color}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Bottom CTA */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={cardTransition}
            viewport={{ once: true }}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="xl" color={textColor} fontWeight="semibold">
                Your story could be next.
              </Text>
              <Text fontSize="lg" color={mutedColor}>
                Join thousands who've transformed their daily routines with voice-first technology.
              </Text>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
