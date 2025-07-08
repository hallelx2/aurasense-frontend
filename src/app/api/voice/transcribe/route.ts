import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Groq } from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

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

    // TODO: Process with custom backend
    // This is where we'll add the custom processing logic
    // For now, we'll just echo the transcription back
    const agentResponseText = `You said: ${transcription}`;

    // Generate audio response using Groq TTS
    const ttsResponse = await groq.audio.speech.create({
        model: "playai-tts",
        voice: "Fritz-PlayAI",
        input: agentResponseText,
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
