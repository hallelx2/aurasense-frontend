"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioProcessingConfig } from '@/types/voice';

interface VoiceRecordingOptions {
  maxDuration?: number; // in seconds
  autoStopAfterMaxDuration?: boolean;
  processingConfig?: Partial<AudioProcessingConfig>;
  onError?: (error: Error) => void;
}

interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  volume: number;
  error: Error | null;
}

const DEFAULT_CONFIG: AudioProcessingConfig = {
  sampleRate: 44100,
  channels: 1,
  encoding: 'OGG_OPUS',
  languageCode: 'en-US',
  enhanceAudio: true,
  removeNoise: true,
  vadLevel: 2
};

export function useVoiceRecording(options: VoiceRecordingOptions = {}) {
  const {
    maxDuration = 60,
    autoStopAfterMaxDuration = true,
    processingConfig = {},
    onError
  } = options;

  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    volume: 0,
    error: null
  });

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }
    };
  }, []);

  const handleError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, isRecording: false, isPaused: false }));
    onError?.(error);
  }, [onError]);

  const updateVolume = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedVolume = average / 255; // Normalize to 0-1 range

    setState(prev => ({ ...prev, volume: normalizedVolume }));
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices) {
        throw new Error('Media devices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: processingConfig.sampleRate || DEFAULT_CONFIG.sampleRate,
          channelCount: processingConfig.channels || DEFAULT_CONFIG.channels
        }
      });

      // Set up audio context and analyser
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const config = { ...DEFAULT_CONFIG, ...processingConfig };
        const blob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          volume: 0
        }));
      };

      mediaRecorder.onerror = (event) => {
        handleError(new Error('MediaRecorder error: ' + event.error.message));
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second

      // Start volume monitoring
      const volumeInterval = setInterval(updateVolume, 100);

      // Start duration tracking
      let duration = 0;
      durationIntervalRef.current = setInterval(() => {
        duration += 1;
        setState(prev => ({ ...prev, duration }));

        if (autoStopAfterMaxDuration && duration >= maxDuration) {
          stopRecording();
        }
      }, 1000);

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null,
        duration: 0
      }));

      return () => {
        clearInterval(volumeInterval);
      };
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to start recording'));
    }
  }, [processingConfig, maxDuration, autoStopAfterMaxDuration, updateVolume, handleError]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      try {
        // Request final data
        mediaRecorderRef.current.requestData();

        // Stop the recorder
        mediaRecorderRef.current.stop();

        // Create blob immediately from chunks
        const blob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });
        setAudioBlob(blob);

        // Reset state
        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          duration: 0,
          volume: 0
        }));
      } catch (error) {
        console.error('Error stopping recording:', error);
        handleError(error instanceof Error ? error : new Error('Failed to stop recording'));
      }
    }
  }, [state.isRecording, handleError]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      volume: 0,
      error: null
    });
  }, []);

  return {
    ...state,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording
  };
}
