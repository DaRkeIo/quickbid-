import React from 'react';
import useCountdown from '../hooks/useCountdown';

interface TimerProps {
  endsAt: string;
}

export default function Timer({ endsAt }: TimerProps) {
  const timeLeft = useCountdown(endsAt);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <span>
      {timeLeft.days}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
    </span>
  );
}
