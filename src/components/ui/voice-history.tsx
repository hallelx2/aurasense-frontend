"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Mic, Speaker, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VoiceCommand, VoiceResponse } from '@/types/voice';

interface VoiceHistoryProps {
  commands: Array<VoiceCommand & { response?: VoiceResponse }>;
  className?: string;
  onCommandSelect?: (command: VoiceCommand) => void;
}

export function VoiceHistory({
  commands,
  className,
  onCommandSelect
}: VoiceHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new commands
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex flex-col space-y-4 overflow-y-auto max-h-[500px] p-4',
        'scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent',
        className
      )}
    >
      <AnimatePresence initial={false}>
        {commands.map((command) => (
          <motion.div
            key={command.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'flex flex-col space-y-2 p-4 rounded-lg',
              'bg-gradient-to-r from-orange-50 to-orange-100',
              'hover:from-orange-100 hover:to-orange-200 transition-colors duration-200',
              'cursor-pointer'
            )}
            onClick={() => onCommandSelect?.(command)}
          >
            {/* Command */}
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <Mic className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {command.transcription?.text || 'Processing...'}
                  </p>
                  <time className="text-xs text-gray-500">
                    {format(new Date(command.timestamp), 'HH:mm')}
                  </time>
                </div>
                {command.transcription?.confidence && (
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {Math.round(command.transcription.confidence * 100)}%
                  </p>
                )}
              </div>
            </div>

            {/* Response */}
            {command.response && (
              <div className="flex items-start space-x-3 pl-8 mt-2">
                <div className="mt-1">
                  <Speaker className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      {command.response.text}
                    </p>
                    <time className="text-xs text-gray-500">
                      {format(new Date(command.response.timestamp), 'HH:mm')}
                    </time>
                  </div>
                  {command.response.metadata?.emotion && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tone: {command.response.metadata.emotion}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {command.processingStatus === 'failed' && (
              <div className="flex items-center space-x-2 pl-8 mt-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">Failed to process command</p>
              </div>
            )}

            {/* Context Tags */}
            {command.context && (
              <div className="flex flex-wrap gap-2 pl-8 mt-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                  {command.context.agentType}
                </span>
                {Object.entries(command.context.userState || {}).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {commands.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Mic className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No voice commands yet</p>
          <p className="text-xs mt-1">Start speaking to see your history</p>
        </div>
      )}
    </div>
  );
}
