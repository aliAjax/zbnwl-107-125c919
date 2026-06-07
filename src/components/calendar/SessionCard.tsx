import { Users, MapPin, User, DollarSign } from 'lucide-react';
import type { Session, Script, Room, Host } from '@/types';
import { formatTime } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/Badge';
import { CountdownTimer } from '@/components/session/CountdownTimer';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  script: Script | undefined;
  room: Room | undefined;
  host: Host | undefined;
  onClick?: () => void;
}

const paymentStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  paid: { label: '已付款', variant: 'success' },
  partial: { label: '部分付款', variant: 'warning' },
  unpaid: { label: '未付款', variant: 'danger' }
};

const typeColors: Record<string, string> = {
  '恐怖': 'from-rose-600 to-red-700',
  '情感': 'from-amber-500 to-orange-600',
  '推理': 'from-blue-500 to-indigo-600',
  '欢乐': 'from-emerald-500 to-green-600',
  '阵营': 'from-purple-500 to-violet-600',
  '其他': 'from-slate-500 to-slate-600'
};

export function SessionCard({ session, script, room, host, onClick }: SessionCardProps) {
  const payment = paymentStatusConfig[session.paymentStatus];
  const scriptType = script?.type || '其他';
  const gradientClass = typeColors[scriptType] || typeColors['其他'];

  if (session.status === 'cancelled') {
    return (
      <div
        className={cn(
          'relative rounded-lg border border-dashed border-slate-600 bg-slate-800/30 p-3 cursor-pointer',
          'hover:bg-slate-800/50 transition-all duration-200 opacity-60'
        )}
        onClick={onClick}
      >
        <div className="text-sm text-slate-500 line-through">
          {script?.name || '未知剧本'}（已取消）
        </div>
        <div className="text-xs text-slate-600">
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5',
        'group'
      )}
      onClick={onClick}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-r opacity-20', gradientClass)} />
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b', gradientClass)} />
      <div className="relative bg-slate-800/80 backdrop-blur-sm p-3 pl-4 border border-slate-700/50 rounded-lg group-hover:border-slate-600">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-white text-sm font-display truncate">
            {script?.name || '未知剧本'}
          </h4>
          <Badge variant={payment.variant} className="flex-shrink-0">
            {payment.label}
          </Badge>
        </div>

        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="truncate">{room?.name || '未知房间'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={12} className="flex-shrink-0" />
            <span className="truncate">DM: {host?.name || '未知'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{session.playerCount}人</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={12} />
              <span>¥{session.paidAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-700/50">
          <CountdownTimer startTime={session.startTime} status={session.status} />
        </div>
      </div>
    </div>
  );
}
