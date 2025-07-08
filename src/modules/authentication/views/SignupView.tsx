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
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SignupSchema, SignupInput } from '@/types/auth';
import { authService } from '@/lib/api/auth';

const MotionCard = motion(Card);

export default function SignupView() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<SignupInput>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
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
    const result = SignupSchema.safeParse(form);
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
      // Register the user
      const registerResponse = await authService.register({
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
      });

      if (!registerResponse?.data?.user) {
        throw new Error('Registration failed');
      }

      // Sign in the user after successful registration
      const signInResponse = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        toast({
          title: "Authentication Error",
          description: "Error signing in after registration. Please try logging in manually.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push('/auth/signin');
        return;
      }

      // Refresh to get the latest session
      router.refresh();

      // Redirect to onboarding after successful registration
      router.push('/onboarding');
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.response?.data?.message || "An error occurred during registration",
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
                Create Your Account
              </Heading>
              <Text color="gray.500" fontSize="md">
                Join Aurasense and unlock a voice-first lifestyle.
              </Text>
            </VStack>
          </CardHeader>
          <CardBody pt={4}>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <HStack spacing={4} w="full">
                  <FormControl isRequired isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </HStack>
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
                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
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
                  isLoading={loading}
                  loadingText="Creating account..."
                  variant="solid"
                  fontWeight="bold"
                  fontSize="lg"
                  mt={2}
                  boxShadow="0 4px 24px rgba(255,107,53,0.10)"
                >
                  Sign Up
                </Button>
              </VStack>
            </Box>
          </CardBody>
          <CardFooter justifyContent="center" pt={0}>
            <Text color="gray.500" fontSize="sm">
              Already have an account?{' '}
              <Link as={NextLink} href="/auth/signin" color="primary.500" fontWeight="bold">
                Log in
              </Link>
            </Text>
          </CardFooter>
        </MotionCard>
      </Container>
    </Box>
  );
}
