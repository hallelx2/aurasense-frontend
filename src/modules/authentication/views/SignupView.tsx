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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

const MotionCard = motion(Card);

export default function SignupView() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!form.first_name) newErrors.first_name = 'First name is required';
    if (!form.last_name) newErrors.last_name = 'Last name is required';
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teepon.tech';
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Signup failed');
      }

      toast({
        title: "Account created!",
        description: "You can now sign in with your new credentials.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push('/auth/signin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up",
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
                  <UserPlus size={32} color="white" />
                </Box>
              </HStack>
              <Heading as="h2" size="lg" fontWeight="bold" color="primary.600">
                Create Account
              </Heading>
              <Text color="gray.500" fontSize="md">
                Join Aurasense today
              </Text>
            </VStack>
          </CardHeader>

          <Box as="form" onSubmit={handleSubmit}>
            <CardBody pt={4}>
              <VStack spacing={5}>
                <FormControl isRequired isInvalid={!!errors.first_name}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="first_name"
                    placeholder="First name"
                    value={form.first_name}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.last_name}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="last_name"
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                  <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

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
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
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
                  colorScheme="primary"
                  isLoading={loading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>
              </VStack>
            </CardBody>
          </Box>

          <CardFooter pt={0}>
            <VStack w="full" spacing={4}>
              <Text color="gray.500">
                Already have an account?{' '}
                <Link
                  as={NextLink}
                  href="/auth/signin"
                  color="primary.500"
                  fontWeight="medium"
                  _hover={{ color: 'primary.600' }}
                >
                  Sign in
                </Link>
              </Text>
            </VStack>
          </CardFooter>
        </MotionCard>
      </Container>
    </Box>
  );
}
