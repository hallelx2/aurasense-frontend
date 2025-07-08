'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  useColorModeValue,
  Center,
  Icon,
  SimpleGrid,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Clock, Shield, Heart, CheckCircle } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

interface FinalCTAProps {
  onGetStarted: () => void;
}

const benefits = [
  {
    icon: Clock,
    text: "Start using immediately",
    subtext: "No downloads or setup required"
  },
  {
    icon: Shield,
    text: "Your data stays private",
    subtext: "End-to-end encryption"
  },
  {
    icon: Heart,
    text: "Health-first approach",
    subtext: "Built for your wellbeing"
  },
  {
    icon: CheckCircle,
    text: "Always accessible",
    subtext: "Works for everyone"
  }
];

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.500, secondary.500, fresh.500)',
    'linear(to-br, primary.600, secondary.600, fresh.600)'
  );
  const toast = useToast();

  const handleMicClick = async () => {
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
    }
  };

  return (
    <Box
      bgGradient={bgGradient}
      py={24}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} textAlign="center" color="white">
          {/* Main CTA */}
          <MotionVStack
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            spacing={8}
          >
            <MotionBox
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Center
                w={24}
                h={24}
                bg="white"
                borderRadius="full"
                boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                mb={8}
              >
                <UseAnimations
                  animation={microphone}
                  size={64}
                  style={{ color: '#FF6B35', cursor: 'pointer' }}
                  onClick={handleMicClick}
                />
              </Center>
            </MotionBox>

            <MotionVStack
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              spacing={6}
            >
              <MotionHeading
                as="h2"
                fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                lineHeight="shorter"
                maxW="5xl"
              >
                Your Voice Is Powerful.
                <br />
                <Box as="span" color="white" opacity={0.9}>
                  Let's Put It to Work.
                </Box>
              </MotionHeading>

              <MotionText
                fontSize={{ base: 'xl', md: '2xl' }}
                opacity={0.9}
                maxW="4xl"
                lineHeight="tall"
                fontWeight="medium"
              >
                Stop struggling with apps that weren't built for you.
                Join the voice-first revolution and experience technology that truly understands.
              </MotionText>
            </MotionVStack>
          </MotionVStack>

          {/* Benefits Grid */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            w="full"
          >
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              {benefits.map((benefit, index) => (
                <VStack
                  key={benefit.text}
                  spacing={3}
                  p={6}
                  bg="whiteAlpha.200"
                  borderRadius="xl"
                  backdropFilter="blur(10px)"
                  border="1px"
                  borderColor="whiteAlpha.300"
                >
                  <Icon as={benefit.icon} boxSize={8} color="white" />
                  <VStack spacing={1} textAlign="center">
                    <Text fontSize="md" fontWeight="semibold">
                      {benefit.text}
                    </Text>
                    <Text fontSize="sm" opacity={0.8}>
                      {benefit.subtext}
                    </Text>
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* CTA Buttons */}
          <MotionVStack
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            spacing={6}
          >
            <Button
              size="xl"
              bg="white"
              color="primary.500"
              rightIcon={<ArrowRight />}
              onClick={onGetStarted}
              _hover={{
                transform: 'translateY(-3px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                bg: 'whiteAlpha.900'
              }}
              _active={{
                transform: 'translateY(-1px)',
              }}
              px={12}
              py={8}
              fontSize="xl"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
            >
              Start Your Journey Now
            </Button>

            <VStack spacing={3}>
              <HStack spacing={6} fontSize="sm" opacity={0.9} wrap="wrap" justify="center">
                <HStack>
                  <Icon as={Mic} boxSize={4} />
                  <Text>Free to Try</Text>
                </HStack>
                <Text>•</Text>
                <HStack>
                  <Icon as={Shield} boxSize={4} />
                  <Text>Privacy First</Text>
                </HStack>
                <Text>•</Text>
                <HStack>
                  <Icon as={Heart} boxSize={4} />
                  <Text>Built for You</Text>
                </HStack>
              </HStack>

              <Text fontSize="sm" opacity={0.8} maxW="md">
                Join 10,000+ users who've transformed their daily routines with voice-first technology
              </Text>
            </VStack>
          </MotionVStack>

          {/* Social Proof Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            bg="whiteAlpha.200"
            p={6}
            borderRadius="2xl"
            backdropFilter="blur(10px)"
            border="1px"
            borderColor="whiteAlpha.300"
            w="full"
            maxW="4xl"
          >
            <HStack spacing={8} wrap="wrap" justify="center" fontSize="sm">
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">10,000+</Text>
                <Text opacity={0.8}>Active Users</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">4.9★</Text>
                <Text opacity={0.8}>User Rating</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">98%</Text>
                <Text opacity={0.8}>Health Accuracy</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">&lt;3s</Text>
                <Text opacity={0.8}>Response Time</Text>
              </VStack>
            </HStack>
          </MotionBox>
        </VStack>
      </Container>

      {/* Background Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        opacity={0.2}
      >
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="300px"
          h="300px"
          bg="white"
          borderRadius="full"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          w="250px"
          h="250px"
          bg="white"
          borderRadius="full"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="400px"
          h="400px"
          bg="white"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.3}
        />
      </Box>
    </Box>
  );
}
