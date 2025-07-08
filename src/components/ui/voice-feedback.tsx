"use client";

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import { cn } from '@/lib/utils';

interface VoiceFeedbackProps {
  isRecording: boolean;
  isPaused: boolean;
  volume: number;
  error: Error | null;
  className?: string;
}

export function VoiceFeedback({
  isRecording,
  isPaused,
  volume,
  error,
  className
}: VoiceFeedbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw volume visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRecording || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !isRecording || isPaused) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate circle size based on volume (0-1)
      const minRadius = 20;
      const maxRadius = 40;
      const radius = minRadius + (maxRadius - minRadius) * volume;

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'; // orange-500 with opacity
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw inner circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius * 0.7, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.2)'; // orange-500 with more opacity
      ctx.fill();

      requestAnimationFrame(draw);
    };

    draw();
  }, [isRecording, isPaused, volume]);

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <AnimatePresence>
        {/* Background pulse animation */}
        {isRecording && !isPaused && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-16 h-16 bg-orange-500 rounded-full"
          />
        )}

        {/* Volume visualization canvas */}
        <canvas
          ref={canvasRef}
          width={100}
          height={100}
          className="absolute pointer-events-none"
        />

        {/* Microphone icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isRecording && !isPaused ? 1.1 : 1,
            opacity: isPaused ? 0.5 : 1
          }}
          className="relative z-10"
        >
          <UseAnimations
            animation={microphone}
            size={40}
            strokeColor={error ? '#EF4444' : '#F97316'} // red-500 for error, orange-500 for normal
            className={cn(
              'transition-colors duration-200',
              isRecording && !isPaused && 'animate-pulse'
            )}
          />
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-red-500 whitespace-nowrap"
          >
            {error.message}
          </motion.div>
        )}

        {/* Recording status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-full ml-4 whitespace-nowrap text-sm font-medium"
        >
          {isRecording && !isPaused && 'Recording...'}
          {isRecording && isPaused && 'Paused'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
