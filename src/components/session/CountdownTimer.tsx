import { useCountdown } from '@/hooks/useCountdown';
import { Clock, AlertTriangle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  startTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export function CountdownTimer({ startTime, status }: CountdownTimerProps) {
  const countdown = useCountdown(startTime);

  if (status === 'completed') {
    return (
      <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
        <Play size={14} />
        <span>已完成</span>
      </div>
    );
  }

  if (status === 'ongoing') {
    return (
      <div className="flex items-center gap-1.5 text-amber-400 text-sm">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>进行中</span>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
        <span>已取消</span>
      </div>
    );
  }

  if (countdown.isPast) {
    return (
      <div className="flex items-center gap-1.5 text-amber-400 text-sm">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>已到开场时间</span>
      </div>
    );
  }

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  const getColorClass = () => {
    if (countdown.isUrgent) return 'text-rose-400';
    if (countdown.isWarning) return 'text-amber-400';
    return 'text-slate-300';
  };

  return (
    <div className={cn('flex items-center gap-1.5 text-sm', getColorClass())}>
      {countdown.isUrgent ? (
        <AlertTriangle size={14} className="animate-pulse" />
      ) : (
        <Clock size={14} />
      )}
      <span className="font-mono">
        {countdown.days > 0 && `${countdown.days}天 `}
        {formatNumber(countdown.hours)}:{formatNumber(countdown.minutes)}:{formatNumber(countdown.seconds)}
      </span>
    </div>
  );
}
