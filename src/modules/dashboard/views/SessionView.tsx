"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Center,
  Button,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { Mic, MessageSquare, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import type { Session } from 'next-auth';

interface SessionViewProps {
  user: Session['user'];
  onSessionSelect: (sessionId: string) => void;
}

export function SessionView({ user, onSessionSelect }: SessionViewProps) {
  const { startRecording, stopRecording, isRecording } = useVoiceRecording();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const sessions = [
    {
      id: '1',
      title: 'Food Discovery',
      description: 'Find restaurants and order food',
      icon: MessageSquare,
      date: '2024-03-20',
      time: '10:30 AM',
    },
    {
      id: '2',
      title: 'Travel Planning',
      description: 'Plan your next trip',
      icon: Calendar,
      date: '2024-03-19',
      time: '2:45 PM',
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg">Welcome back, {user.name?.split(' ')[0]}</Heading>
        <Text color="gray.500">Your voice-first lifestyle companion</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {sessions.map((session) => (
          <Card
            key={session.id}
            cursor="pointer"
            onClick={() => onSessionSelect(session.id)}
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack spacing={4}>
                  <Avatar
                    icon={<Icon as={session.icon} />}
                    bg="primary.500"
                    color="white"
                  />
                  <Box flex={1}>
                    <Heading size="sm">{session.title}</Heading>
                    <Text color="gray.500" fontSize="sm">
                      {session.description}
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={4} color="gray.500" fontSize="sm">
                  <HStack>
                    <Icon as={Calendar} size={16} />
                    <Text>{session.date}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={Clock} size={16} />
                    <Text>{session.time}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Center py={8}>
        <VStack>
          <Button
            size="lg"
            borderRadius="full"
            colorScheme={isRecording ? "red" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            isLoading={isTranscribing}
          >
            <Icon as={Mic} />
          </Button>
          <Text fontSize="sm" color="gray.500">
            {isRecording ? "Recording..." : "Press to speak"}
          </Text>
        </VStack>
      </Center>
    </VStack>
  );
}
