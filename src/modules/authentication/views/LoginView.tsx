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
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import NextLink from 'next/link';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
    // TODO: Add API call here
    setTimeout(() => setLoading(false), 1200);
  };

  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50, fresh.50)',
    'linear(to-br, primary.900, secondary.900, fresh.900)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={16}>
      <Container maxW="md">
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
          <CardBody as="form" onSubmit={handleSubmit} pt={4}>
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
                loadingText="Logging in..."
                variant="solid"
                fontWeight="bold"
                fontSize="lg"
                mt={2}
                boxShadow="0 4px 24px rgba(255,107,53,0.10)"
              >
                Log In
              </Button>
            </VStack>
          </CardBody>
          <CardFooter justifyContent="center" pt={0}>
            <Text color="gray.500" fontSize="sm">
              New to Aurasense?{' '}
              <Link as={NextLink} href="/auth/signup" color="primary.500" fontWeight="bold">
                Create an account
              </Link>
            </Text>
          </CardFooter>
        </MotionCard>
      </Container>
    </Box>
  );
}
