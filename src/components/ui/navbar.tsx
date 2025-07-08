'use client';

import {
  Box,
  HStack,
  Button,
  Container,
  Text,
  useColorModeValue,
  useDisclosure,
  IconButton,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Mic, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface NavbarProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
}

export function Navbar({ onGetStarted, onLogin, onSignUp }:   NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { scrollY } = useScroll();

  const navbarBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
  const navbarShadow = useColorModeValue('xl', 'dark-lg');

  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const scale = useTransform(scrollY, [0, 100], [0.95, 1]);
  const y = useTransform(scrollY, [0, 100], [20, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      router.push('/onboarding');
    }
  };

  const handleLogin = () => {
      router.push('/auth/signin');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    onClose();
  };

  const navItems = [
    { label: 'How It Works', href: '#how-it-works', onClick: () => scrollToSection('how-it-works') },
    { label: 'Features', href: '#features', onClick: () => scrollToSection('features') },
    { label: 'Agents', href: '#agents', onClick: () => scrollToSection('agents') },
    { label: 'Community', href: '#community', onClick: () => scrollToSection('community') },
  ];

  return (
    <>
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        w="full"
        style={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <Box
          bg={navbarBg}
          backdropFilter="blur(20px)"
          borderBottom="1px"
          borderColor="gray.200"
          px={0}
          py={4}
        >
          <Container maxW="container.xl">
            <HStack justify="space-between" align="center">
              {/* Logo */}
              <HStack spacing={3}>
                <Box
                  w={10}
                  h={10}
                  bg="primary.500"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Mic size={20} color="white" />
                </Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  Aurasense
                </Text>
              </HStack>

              {/* Desktop Navigation */}
              <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    _hover={{
                      bg: 'primary.50',
                      color: 'primary.600',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                  >
                    {item.label}
                  </Button>
                ))}
              </HStack>

              {/* Action Buttons */}
              <HStack spacing={4}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  display={{ base: 'none', sm: 'inline-flex' }}
                  _hover={{
                    bg: 'gray.100',
                    transform: 'translateY(-1px)',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignUp}
                  display={{ base: 'none', sm: 'inline-flex' }}
                  borderColor="primary.300"
                  color="primary.600"
                  _hover={{
                    bg: 'primary.50',
                    borderColor: 'primary.400',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Sign Up
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={handleGetStarted}
                  bg="primary.500"
                  color="white"
                  _hover={{
                    bg: 'primary.600',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  Get Started
                </Button>
                <IconButton
                  aria-label="Open menu"
                  icon={<Menu size={20} />}
                  variant="ghost"
                  size="sm"
                  display={{ base: 'flex', md: 'none' }}
                  onClick={onOpen}
                  _hover={{
                    bg: 'gray.100',
                  }}
                />
              </HStack>
            </HStack>
          </Container>
        </Box>
      </MotionBox>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="primary.500"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Mic size={16} color="white" />
              </Box>
              <Text fontSize="lg" fontWeight="bold">
                Aurasense
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch" pt={6}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="lg"
                  onClick={item.onClick}
                  justifyContent="flex-start"
                  _hover={{
                    bg: 'primary.50',
                    color: 'primary.600',
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Box pt={6}>
                <VStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLogin}
                    w="full"
                  >
                    Login
                  </Button>
                  <Button
                    variant="solid"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                    onClick={handleGetStarted}
                    w="full"
                    bg="primary.500"
                    color="white"
                  >
                    Get Started
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
