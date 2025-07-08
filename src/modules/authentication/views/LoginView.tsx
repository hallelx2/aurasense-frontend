"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  IconButton,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginSchema, LoginInput } from '@/types/auth';

const MotionCard = motion(Card);

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Zod validation
    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});

    try {
      const response = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (response?.error) {
        toast({
          title: "Authentication Error",
          description: "Invalid email or password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Refresh to get the latest session
      router.refresh();

      // Check if user needs onboarding (we'll get this from the session)
      // For now, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during sign in",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50, fresh.50)',
    'linear(to-br, primary.900, secondary.900, fresh.900)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={16}>
      <Container maxW="md">
        <Link
          as={NextLink}
          href="/"
          display="flex"
          alignItems="center"
          gap={2}
          color="primary.500"
          fontWeight="medium"
          mb={4}
          _hover={{ color: 'primary.600', textDecoration: 'none' }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <MotionCard
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          boxShadow="2xl"
          borderRadius="2xl"
          bg={useColorModeValue('white', 'gray.900')}
        >
          <CardHeader textAlign="center" pb={0}>
            <VStack spacing={2}>
              <HStack justify="center">
                <Box
                  bg="primary.500"
                  borderRadius="full"
                  p={3}
                  boxShadow="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LogIn size={32} color="white" />
                </Box>
              </HStack>
              <Heading as="h2" size="lg" fontWeight="bold" color="primary.600">
                Welcome Back
              </Heading>
              <Text color="gray.500" fontSize="md">
                Log in to your Aurasense account
              </Text>
            </VStack>
          </CardHeader>
          <Box as="form" onSubmit={handleSubmit}>
            <CardBody pt={4}>
              <VStack spacing={5}>
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <EyeOff /> : <Eye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  colorScheme="primary"
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </CardBody>
          </Box>
          <CardFooter pt={0}>
            <VStack w="full" spacing={4}>
              <Link
                as={NextLink}
                href="/auth/forgot-password"
                color="primary.500"
                fontWeight="medium"
                _hover={{ color: 'primary.600', textDecoration: 'none' }}
              >
                Forgot your password?
              </Link>
              <Text color="gray.500">
                Don't have an account?{' '}
                <Link
                  as={NextLink}
                  href="/auth/signup"
                  color="primary.500"
                  fontWeight="medium"
                  _hover={{ color: 'primary.600', textDecoration: 'none' }}
                >
                  Sign up
                </Link>
              </Text>
            </VStack>
          </CardFooter>
        </MotionCard>
      </Container>
    </Box>
  );
}
