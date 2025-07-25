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
} from '@chakra-ui/react';
import { motion, Transition } from 'framer-motion';
import { ArrowRight, Volume2, Mic } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const cardTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
};

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="cta" bg="primary.500" py={20} position="relative" overflow="hidden">
      <Container maxW="container.xl">
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={cardTransition}
          viewport={{ once: true }}
            spacing={4}
          >
            <MotionHeading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
              maxW="4xl"
            >
              Ready to Transform Your Lifestyle?
            </MotionHeading>

            <MotionText
              fontSize={{ base: 'lg', md: 'xl' }}
              color="whiteAlpha.900"
              maxW="3xl"
              lineHeight="tall"
            >
              Join thousands of users who've discovered the power of voice-first technology.
              Your journey to accessible, health-aware lifestyle choices starts now.
            </MotionText>
          </MotionVStack>

          <MotionVStack
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{
            ...cardTransition,
            delay: 0.2
          }}
            viewport={{ once: true }}
            spacing={4}
          >
            <Button
              size="xl"
              bg="white"
              color="primary.500"
              rightIcon={<ArrowRight />}
              onClick={onGetStarted}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
                bg: 'whiteAlpha.900'
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              px={8}
              py={4}
              fontSize="lg"
              fontWeight="bold"
            >
              Start Your Voice Journey
            </Button>

            <HStack spacing={4} color="whiteAlpha.800" fontSize="sm">
              <HStack>
                <Icon as={Volume2} boxSize={4} />
                <Text>Free to Start</Text>
              </HStack>
              <Text>•</Text>
              <HStack>
                <Icon as={Mic} boxSize={4} />
                <Text>No Setup Required</Text>
              </HStack>
              <Text>•</Text>
              <Text>Privacy-First</Text>
            </HStack>
        </MotionVStack>
      </Container>

      {/* Background Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        opacity={0.1}
      >
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="200px"
          h="200px"
          bg="white"
          borderRadius="full"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          w="150px"
          h="150px"
          bg="white"
          borderRadius="full"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="300px"
          h="300px"
          bg="white"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.5}
        />
      </Box>
    </Box>
  );
}
