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
  Avatar,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion, Transition } from 'framer-motion';
import {
  Quote,
  Star,
  CheckCircle,
  Users,
  Heart,
  Clock
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

const testimonials = [
  {
    name: "Dr. Amanda Chen",
    role: "Accessibility Advocate",
    avatar: "👩‍⚕️",
    rating: 5,
    quote: "Finally, technology that truly understands accessibility. Aurasense doesn't just add voice as an afterthought—it's built voice-first from the ground up.",
    highlight: "Built voice-first from the ground up",
    verified: true,
    tags: ["Accessibility Expert"]
  },
  {
    name: "Roberto Martinez",
    role: "Type 1 Diabetic",
    avatar: "👨‍🍳",
    rating: 5,
    quote: "As someone who needs to carefully monitor carbs, having an AI that actually understands my dietary restrictions and finds safe options is life-changing.",
    highlight: "Life-changing for health management",
    verified: true,
    tags: ["Health Management"]
  },
  {
    name: "Priya Patel",
    role: "Working Mom",
    avatar: "👩‍💼",
    rating: 5,
    quote: "Between work and kids, I barely have time to think. Being able to just say 'find family dinner options' and get perfect results saves my sanity daily.",
    highlight: "Saves my sanity daily",
    verified: true,
    tags: ["Busy Parent"]
  }
];

const stats = [
  {
    number: "10,000+",
    label: "Active Users",
    description: "Trust Aurasense daily",
    icon: Users,
    color: "primary.500"
  },
  {
    number: "98%",
    label: "Accuracy Rate",
    description: "For health-safe recommendations",
    icon: CheckCircle,
    color: "fresh.500"
  },
  {
    number: "<3s",
    label: "Response Time",
    description: "Average voice-to-result",
    icon: Clock,
    color: "secondary.500"
  },
  {
    number: "4.9★",
    label: "User Rating",
    description: "Across all platforms",
    icon: Star,
    color: "accent.500"
  }
];

const cardTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
};

export function SocialProof() {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="social-proof" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          {/* Stats Section */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={cardTransition}
            viewport={{ once: true }}
            spacing={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Badge colorScheme="primary" px={4} py={2} borderRadius="full" fontSize="sm">
                Trusted by thousands
              </Badge>
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold"
                color={textColor}
                lineHeight="shorter"
              >
                The Numbers Don't Lie
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
              {stats.map((stat, index) => (
                <MotionCard
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    ...cardTransition,
                    delay: index * 0.1
                  }}
                  viewport={{ once: true }}
                  textAlign="center"
                  bg="gray.50"
                  borderRadius="xl"
                  whileHover={{
                    y: -4,
                    transition: cardTransition
                  }}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <CardBody p={8}>
                    <VStack spacing={4}>
                      <Icon as={stat.icon} boxSize={8} color={stat.color} />
                      <VStack spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                          {stat.number}
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold" color={stat.color}>
                          {stat.label}
                        </Text>
                        <Text fontSize="sm" color={mutedColor}>
                          {stat.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </MotionVStack>

          {/* Testimonials Section */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={cardTransition}
            viewport={{ once: true }}
            spacing={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading
                as="h3"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="bold"
                color={textColor}
                lineHeight="shorter"
              >
                Stories That Matter
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={mutedColor}
                maxW="3xl"
                lineHeight="tall"
              >
                Real users sharing how Aurasense transformed their daily lives.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {testimonials.map((testimonial, index) => (
                <MotionCard
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    ...cardTransition,
                    delay: index * 0.1
                  }}
                  viewport={{ once: true }}
                  bg="white"
                  boxShadow="xl"
                  borderRadius="2xl"
                  overflow="hidden"
                  whileHover={{
                    y: -4,
                    boxShadow: '2xl',
                    transition: cardTransition
                  }}
                  style={{ transition: 'all 0.3s ease' }}
                  border="1px"
                  borderColor="gray.100"
                  position="relative"
                >
                  <CardBody p={8}>
                    <VStack spacing={6} align="start" h="full">
                      {/* Quote Icon */}
                      <Icon as={Quote} boxSize={8} color="primary.200" />

                      {/* Rating */}
                      <HStack spacing={1}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Icon key={i} as={Star} boxSize={4} color="yellow.400" fill="currentColor" />
                        ))}
                      </HStack>

                      {/* Quote */}
                      <Text color="gray.700" lineHeight="tall" fontSize="lg" flex={1}>
                        "{testimonial.quote}"
                      </Text>

                      {/* Highlight */}
                      <Box
                        bg="primary.50"
                        px={4}
                        py={2}
                        borderRadius="lg"
                        border="1px"
                        borderColor="primary.200"
                      >
                        <Text color="primary.700" fontSize="sm" fontWeight="semibold">
                          💡 {testimonial.highlight}
                        </Text>
                      </Box>

                      {/* User Info */}
                      <HStack spacing={4} w="full">
                        <Text fontSize="3xl">{testimonial.avatar}</Text>
                        <VStack spacing={1} align="start" flex={1}>
                          <HStack>
                            <Text fontSize="md" fontWeight="bold" color="gray.800">
                              {testimonial.name}
                            </Text>
                            {testimonial.verified && (
                              <Icon as={CheckCircle} boxSize={4} color="blue.500" />
                            )}
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {testimonial.role}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Tags */}
                      <Flex gap={2} wrap="wrap">
                        {testimonial.tags.map((tag) => (
                          <Badge key={tag} colorScheme="primary" variant="subtle" fontSize="xs">
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </MotionVStack>

          {/* Community Trust */}
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
              <Icon as={Heart} boxSize={12} color="primary.500" />
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Trusted by Healthcare Professionals
                </Text>
                <Text color={mutedColor} maxW="2xl">
                  Recommended by dietitians, accessibility experts, and healthcare providers
                  who understand the importance of safe, reliable lifestyle technology.
                </Text>
              </VStack>
              <HStack spacing={6} wrap="wrap" justify="center" fontSize="sm" color={mutedColor}>
                <Text>🏥 Hospital Partnerships</Text>
                <Text>👩‍⚕️ Dietitian Approved</Text>
                <Text>♿ Accessibility Certified</Text>
              </HStack>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
