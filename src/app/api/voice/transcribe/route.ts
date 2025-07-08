import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Groq } from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// System prompt for the food agent
const FOOD_AGENT_PROMPT = `You are Chef, a highly knowledgeable and empathetic food discovery agent in the Aurasense system.
Your role is to help users discover and order food while being mindful of their:
- Dietary preferences and restrictions
- Health conditions and allergies
- Cultural background and preferences
- Spice tolerance levels
- Price preferences

Always maintain a warm, professional tone and prioritize user safety regarding allergies and health conditions.
If you're unsure about any health-related aspects, err on the side of caution and recommend safer alternatives.

IMPORTANT: Keep responses very concise (maximum 2-3 sentences) as they will be converted to speech.
Focus on the most relevant information only.

Current user profile context will be provided in each interaction.
Base your responses on this context to provide personalized recommendations.

Keep responses concise but informative, focusing on:
1. Direct answers to user queries
2. Relevant health/safety considerations
3. Personalized suggestions based on user preferences
4. Clear next steps or questions to refine recommendations`;

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const userProfile = formData.get('userProfile') as string;
    const userContext = userProfile ? JSON.parse(userProfile) : {};

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await writeFile(join(uploadDir, '.gitkeep'), '');

    // Generate unique filename
    const filename = `${uuidv4()}.webm`;
    const filepath = join(uploadDir, filename);

    // Convert File to Buffer and save
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Transcribe the audio using Groq
    const transcriptionResponse = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filepath),
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
      timestamp_granularities: ["word", "segment"],
    });
    const transcription = transcriptionResponse.text;

    // Process with Groq chat completions
    const chatResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: FOOD_AGENT_PROMPT
        },
        {
          role: "user",
          content: `User Profile:
Dietary Preferences: ${userContext.preferences?.dietaryRestrictions?.join(', ') || 'None specified'}
Allergies: ${userContext.healthProfile?.allergies?.join(', ') || 'None specified'}
Health Conditions: ${userContext.healthProfile?.conditions?.join(', ') || 'None specified'}
Spice Tolerance: ${userContext.preferences?.spiceTolerance || 'Not specified'}
Cultural Background: ${userContext.culturalPreferences || 'Not specified'}

User Query: ${transcription}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,  // Reduced from 500 to ensure TTS compatibility
      top_p: 0.9,
    });

    const agentResponseText = chatResponse.choices[0].message.content as string;

    // Ensure response isn't too long for TTS
    const truncatedResponse = agentResponseText.length > 200
      ? agentResponseText.substring(0, 197) + '...'
      : agentResponseText;

    // Generate audio response using Groq TTS
    const ttsResponse = await groq.audio.speech.create({
        model: "playai-tts",
        voice: "Fritz-PlayAI",
        input: truncatedResponse,
        response_format: "wav"
    });

    const ttsBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    const responseFilename = `${uuidv4()}-response.wav`;
    const responseFilepath = join(uploadDir, responseFilename);
    await writeFile(responseFilepath, ttsBuffer);

    const responseAudioUrl = `/uploads/${responseFilename}`;

    return NextResponse.json({
      success: true,
      text: transcription,
      response: agentResponseText,
      audioUrl: responseAudioUrl
    });
  } catch (error) {
    console.error('Error processing voice request:', error);
    return NextResponse.json(
      { error: 'Failed to process voice request' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
