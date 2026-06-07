import { useState, useEffect } from 'react';
import { getCountdown, CountdownResult } from '@/utils/dateUtils';

export function useCountdown(targetDate: string | Date): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>(() => getCountdown(targetDate));

  useEffect(() => {
    setCountdown(getCountdown(targetDate));

    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
}
