"use client";

import { Box, HStack, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Icon } from "@chakra-ui/react";
import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <HStack w="full" spacing={2}>
      <audio ref={audioRef} src={src} preload="metadata" onEnded={() => setIsPlaying(false)} />
      <IconButton
        aria-label={isPlaying ? "Pause" : "Play"}
        icon={<Icon as={isPlaying ? Pause : Play} />}
        onClick={togglePlayPause}
        size="sm"
        isRound
      />
      <Slider
        aria-label="time-slider"
        value={currentTime}
        max={duration}
        onChange={(val) => {
          if (audioRef.current) audioRef.current.currentTime = val;
        }}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text fontSize="xs" minW="40px" textAlign="center">
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </HStack>
  );
}
