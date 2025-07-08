'use client';

import {
  Box,
  VStack,
  Text,
  Container,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

interface StorySectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  bg?: string;
  py?: number;
}

export function StorySection({
  id,
  title,
  subtitle,
  children,
  bg,
  py = 20
}: StorySectionProps) {
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');
  const backgroundColor = bg || useColorModeValue('transparent', 'gray.900');

  return (
    <Box
      id={id}
      bg={backgroundColor}
      py={py}
      position="relative"
      className="story-section"
    >
      <Container maxW="container.xl">
        <MotionVStack
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          spacing={4}
          textAlign="center"
          mb={8}
        >
          <MotionHeading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color={textColor}
            lineHeight="shorter"
            maxW="4xl"
          >
            {title}
          </MotionHeading>

          {subtitle && (
            <MotionText
              fontSize={{ base: 'lg', md: 'xl' }}
              color={mutedColor}
              maxW="3xl"
              lineHeight="tall"
            >
              {subtitle}
            </MotionText>
          )}
        </MotionVStack>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {children}
        </MotionBox>
      </Container>
    </Box>
  );
}
