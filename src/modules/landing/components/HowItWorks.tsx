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
  Circle,
  Flex,
  Center,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Mic,
  Brain,
  Zap,
  CheckCircle,
  MessageSquare,
  Search,
  Shield,
  Users
} from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import activity from 'react-useanimations/lib/activity';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const steps = [
  {
    number: "01",
    title: "Speak Naturally",
    description: "Just talk like you would to a friend. No keywords, no commands, no learning curve.",
    icon: Mic,
    animation: microphone,
    color: "primary.500",
    example: "\"I'm craving Thai food but I'm lactose intolerant and on a budget.\""
  },
  {
    number: "02",
    title: "AI Agents Understand",
    description: "Six specialized agents process your health needs, preferences, and context instantly.",
    icon: Brain,
    animation: activity,
    color: "secondary.500",
    example: "Food Agent + Health Agent + Context Agent work together"
  },
  {
    number: "03",
    title: "Smart Recommendations",
    description: "Get personalized results that respect your health, budget, and accessibility needs.",
    icon: Zap,
    color: "fresh.500",
    example: "\"Found 4 lactose-free Thai spots under $15 with great reviews!\""
  },
  {
    number: "04",
    title: "Take Action",
    description: "Book, order, connect, or save—all through voice or simple taps.",
    icon: CheckCircle,
    color: "accent.500",
    example: "\"Should I make a reservation at Thai Garden for 7 PM?\""
  }
];

export function HowItWorks() {
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, primary.50)',
    'linear(to-br, gray.900, primary.900)'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box bg={bgGradient} py={24}>
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
              How It Actually Works
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              From voice to solution in seconds. No learning curve, no complexity.
            </Text>
          </MotionVStack>

          {/* Process Steps */}
          <VStack spacing={12} w="full">
            {steps.map((step, index) => (
              <MotionBox
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                w="full"
              >
                <Flex
                  direction={{ base: 'column', lg: index % 2 === 0 ? 'row' : 'row-reverse' }}
                  align="center"
                  gap={12}
                  w="full"
                >
                  {/* Step Visual */}
                  <VStack spacing={6} flex="1" align="center">
                    <Circle
                      size="120px"
                      bg={step.color}
                      color="white"
                      position="relative"
                      boxShadow="xl"
                    >
                      {step.animation ? (
                        <UseAnimations
                          animation={step.animation}
                          size={60}
                          style={{ color: 'white' }}
                        />
                      ) : (
                        <Icon as={step.icon} boxSize={12} />
                      )}
                    </Circle>

                    <Box
                      bg="white"
                      px={4}
                      py={2}
                      borderRadius="full"
                      boxShadow="md"
                    >
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        {step.number}
                      </Text>
                    </Box>
                  </VStack>

                  {/* Step Content */}
                  <VStack spacing={6} flex="2" align={{ base: 'center', lg: 'start' }} textAlign={{ base: 'center', lg: 'left' }}>
                    <VStack spacing={4} align={{ base: 'center', lg: 'start' }}>
                      <Heading
                        as="h3"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={textColor}
                      >
                        {step.title}
                      </Heading>

                      <Text
                        fontSize="xl"
                        color={mutedColor}
                        lineHeight="tall"
                        maxW="lg"
                      >
                        {step.description}
                      </Text>
                    </VStack>

                    {/* Example */}
                    <Box
                      bg="white"
                      p={6}
                      borderRadius="xl"
                      boxShadow="md"
                      border="1px"
                      borderColor="gray.200"
                      maxW="lg"
                      w="full"
                    >
                      <VStack spacing={3} align="start">
                        <HStack>
                          <Icon as={MessageSquare} color={step.color} boxSize={5} />
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                            EXAMPLE
                          </Text>
                        </HStack>
                        <Text color="gray.800" fontStyle="italic" lineHeight="relaxed">
                          {step.example}
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </Flex>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <Center mt={8}>
                    <Box
                      w="2px"
                      h="60px"
                      bg="gray.300"
                      position="relative"
                      _after={{
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        w: 0,
                        h: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '8px solid',
                        borderTopColor: 'gray.300',
                      }}
                    />
                  </Center>
                )}
              </MotionBox>
            ))}
          </VStack>

          {/* Bottom Features */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            w="full"
          >
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
              {[
                { icon: Shield, label: "Health-Safe", desc: "Always respects restrictions" },
                { icon: Zap, label: "Lightning Fast", desc: "Results in under 3 seconds" },
                { icon: Users, label: "Community", desc: "Connect with like minds" },
                { icon: Search, label: "Context Aware", desc: "Understands your situation" }
              ].map((feature, index) => (
                <VStack
                  key={feature.label}
                  spacing={3}
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  textAlign="center"
                  boxShadow="sm"
                >
                  <Icon as={feature.icon} boxSize={8} color="primary.500" />
                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                    {feature.label}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {feature.desc}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
