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
  Center,
} from '@chakra-ui/react';
import { motion, Transition } from 'framer-motion';
import {
  Shield,
  Zap,
  Heart,
  Users,
  Eye,
  Brain,
  Globe,
  Lock,
  Accessibility
} from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import heart from 'react-useanimations/lib/heart';
import activity from 'react-useanimations/lib/activity';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const cardTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
};

const powerFeatures = [
  {
    icon: Shield,
    animation: null,
    title: "Health-First AI",
    description: "Never worry about unsafe recommendations. Our AI understands allergies, medications, and dietary restrictions at a medical level.",
    benefits: ["Allergy detection", "Drug interaction alerts", "Dietary compliance"],
    color: "health.success",
    badge: "Safety First",
    stat: "99.9% Safe"
  },
  {
    icon: Accessibility,
    animation: activity,
    title: "True Accessibility",
    description: "Designed for everyone, especially those who struggle with traditional apps. Screen readers, motor accessibility, cognitive support.",
    benefits: ["Screen reader optimized", "Voice-only navigation", "Motor accessibility"],
    color: "secondary.500",
    badge: "Universal Design",
    stat: "WCAG 2.2 AAA"
  },
  {
    icon: Brain,
    animation: null,
    title: "Context Intelligence",
    description: "Remembers your preferences, learns from your choices, and understands your situation without you having to repeat yourself.",
    benefits: ["Learns preferences", "Contextual awareness", "Smart memory"],
    color: "primary.500",
    badge: "Smart Learning",
    stat: "94% Accuracy"
  }
];

const trustFeatures = [
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "Your health data never leaves your device. Voice processing is encrypted end-to-end.",
    color: "gray.600"
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Web, mobile, smart speakers. Same experience across all your devices.",
    color: "blue.500"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with others who share your health needs and lifestyle choices.",
    color: "fresh.500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-3-second responses. Faster than typing, faster than scrolling.",
    color: "yellow.500"
  }
];

export function PowerFeatures() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="power-features" bg={bgColor} py={20}>
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
              What Makes Us{' '}
              <Box as="span" color="primary.500">
                Different
              </Box>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Not just another voice app. Built specifically for health-conscious, accessibility-aware users.
            </Text>
          </MotionVStack>

          {/* Power Features */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} w="full">
            {powerFeatures.map((feature, index) => (
              <MotionCard
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  ...cardTransition,
                  delay: index * 0.2
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: cardTransition
                }}
                style={{ transition: 'all 0.3s ease' }}
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                overflow="hidden"
                border="1px"
                borderColor="gray.100"
                h="full"
              >
                <CardBody p={8}>
                  <VStack spacing={6} align="start" h="full">
                    {/* Icon and Badge */}
                    <Flex justify="space-between" align="start" w="full">
                      <Center
                        w={16}
                        h={16}
                        bg={`${feature.color.split('.')[0]}.50`}
                        borderRadius="xl"
                      >
                        {feature.animation ? (
                          <UseAnimations
                            animation={feature.animation}
                            size={40}
                            style={{ color: feature.color }}
                          />
                        ) : (
                          <Icon as={feature.icon} boxSize={8} color={feature.color} />
                        )}
                      </Center>
                      <Badge colorScheme={feature.color.split('.')[0]} variant="subtle">
                        {feature.badge}
                      </Badge>
                    </Flex>

                    {/* Title and Description */}
                    <VStack spacing={4} align="start" flex={1}>
                      <VStack spacing={2} align="start">
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                          {feature.title}
                        </Text>
                        <Text color="gray.600" lineHeight="tall">
                          {feature.description}
                        </Text>
                      </VStack>

                      {/* Benefits List */}
                      <VStack spacing={2} align="start" w="full">
                        {feature.benefits.map((benefit) => (
                          <HStack key={benefit} spacing={2}>
                            <Icon as={Zap} boxSize={4} color={feature.color} />
                            <Text color="gray.700">{benefit}</Text>
                          </HStack>
                        ))}
                    </VStack>

                      {/* Stats */}
                    <Box
                        mt="auto"
                        pt={4}
                        borderTop="1px"
                        borderColor="gray.100"
                      w="full"
                    >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={feature.color}
                        >
                        {feature.stat}
                      </Text>
                    </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Trust Features */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
            {trustFeatures.map((feature, index) => (
              <MotionCard
                key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  ...cardTransition,
                  delay: index * 0.1
                }}
            viewport={{ once: true }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: cardTransition
                }}
                style={{ transition: 'all 0.3s ease' }}
                    bg="white"
                boxShadow="lg"
                borderRadius="xl"
                overflow="hidden"
                border="1px"
                borderColor="gray.100"
                  >
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Center
                      w={12}
                      h={12}
                      bg={`${feature.color.split('.')[0]}.50`}
                      borderRadius="lg"
                    >
                      <Icon as={feature.icon} boxSize={6} color={feature.color} />
                    </Center>

                    <VStack spacing={2} align="start">
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            {feature.title}
                          </Text>
                      <Text color="gray.600" fontSize="sm" lineHeight="tall">
                            {feature.description}
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
