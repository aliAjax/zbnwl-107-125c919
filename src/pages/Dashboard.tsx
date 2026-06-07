import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';
import { useSessionStore } from '@/store/useSessionStore';
import { useRoomStore } from '@/store/useRoomStore';
import { useScriptStore } from '@/store/useScriptStore';
import { useHostStore } from '@/store/useHostStore';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';
import { formatTime, formatDate, isToday } from '@/utils/dateUtils';
import {
  LayoutDashboard,
  Clock,
  DollarSign,
  PlayCircle,
  DoorOpen,
  Users,
  MapPin,
  User,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

const paymentStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  paid: { label: '已付款', variant: 'success' },
  partial: { label: '部分付款', variant: 'warning' },
  unpaid: { label: '未付款', variant: 'danger' }
};

const sessionStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
  scheduled: { label: '待开场', variant: 'warning' },
  ongoing: { label: '进行中', variant: 'info' },
  completed: { label: '已完成', variant: 'success' },
  cancelled: { label: '已取消', variant: 'default' }
};

export default function Dashboard() {
  const sessions = useSessionStore((s) => s.sessions);
  const rooms = useRoomStore((s) => s.rooms);
  const scripts = useScriptStore((s) => s.scripts);
  const hosts = useHostStore((s) => s.hosts);
  const getTypeGradient = useScriptTypeStore((s) => s.getTypeGradient);

  const todaySessions = sessions.filter((s) => isToday(new Date(s.startTime)));
  const sortedTodaySessions = [...todaySessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const unpaidSessions = todaySessions.filter(
    (s) => s.paymentStatus === 'unpaid' || s.paymentStatus === 'partial'
  );
  const ongoingSessions = todaySessions.filter((s) => s.status === 'ongoing');
  const availableRooms = rooms.filter((r) => r.status === 'available');

  const totalRevenue = todaySessions.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPlayers = todaySessions.reduce((sum, s) => sum + s.playerCount, 0);

  const getScriptById = (id: string) => scripts.find((s) => s.id === id);
  const getRoomById = (id: string) => rooms.find((r) => r.id === id);
  const getHostById = (id: string) => hosts.find((h) => h.id === id);

  const getOccupiedRoomIds = () => {
    return ongoingSessions.map((s) => s.roomId);
  };

  const occupiedRoomIds = getOccupiedRoomIds();
  const freeNowRooms = availableRooms.filter((r) => !occupiedRoomIds.includes(r.id));

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display">今日运营看板</h1>
              <p className="text-slate-400">{formatDate(new Date())} 实时运营数据概览</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <CalendarDays size={24} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{todaySessions.length}</p>
                <p className="text-sm text-slate-400">今日开场</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <DollarSign size={24} className="text-rose-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">¥{totalRevenue}</p>
                <p className="text-sm text-slate-400">今日营收</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <PlayCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{ongoingSessions.length}</p>
                <p className="text-sm text-slate-400">进行中场次</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <DoorOpen size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{freeNowRooms.length}/{availableRooms.length}</p>
                <p className="text-sm text-slate-400">可用房间</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">今日开场列表</h2>
                  <Badge variant="info">{sortedTodaySessions.length} 场</Badge>
                </div>
              </div>

              <div className="divide-y divide-slate-700/50">
                {sortedTodaySessions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <CalendarDays size={48} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500">今日暂无场次安排</p>
                  </div>
                ) : (
                  sortedTodaySessions.map((session) => {
                    const script = getScriptById(session.scriptId);
                    const room = getRoomById(session.roomId);
                    const host = getHostById(session.hostId);
                    const payment = paymentStatusConfig[session.paymentStatus];
                    const status = sessionStatusConfig[session.status];
                    const gradientClass = getTypeGradient(script?.type || '');

                    return (
                      <div
                        key={session.id}
                        className={cn(
                          'px-6 py-4 hover:bg-slate-700/30 transition-colors',
                          session.status === 'cancelled' && 'opacity-50'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <p className="text-xl font-bold text-white font-display">
                              {formatTime(session.startTime)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatTime(session.endTime)}
                            </p>
                          </div>

                          <div className={cn('w-1 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b', gradientClass)} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {script?.name || '未知剧本'}
                              </h3>
                              <Badge variant={status.variant}>{status.label}</Badge>
                              <Badge variant={payment.variant}>{payment.label}</Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                <span>{room?.name || '未知房间'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User size={14} />
                                <span>DM: {host?.name || '未知'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                <span>{session.playerCount}人</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign size={14} />
                                <span>¥{session.paidAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-400" />
                <h2 className="text-lg font-semibold text-white">待付款场次</h2>
                <Badge variant="danger">{unpaidSessions.length}</Badge>
              </div>

              <div className="divide-y divide-slate-700/50">
                {unpaidSessions.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-400 text-sm">所有场次已结清</p>
                  </div>
                ) : (
                  unpaidSessions.map((session) => {
                    const script = getScriptById(session.scriptId);
                    const payment = paymentStatusConfig[session.paymentStatus];

                    return (
                      <div key={session.id} className="px-6 py-3 hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">
                            {script?.name || '未知剧本'}
                          </p>
                          <Badge variant={payment.variant}>{payment.label}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{formatTime(session.startTime)}</span>
                          <span>¥{session.paidAmount}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <Timer size={18} className="text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">进行中场次</h2>
                <Badge variant="info">{ongoingSessions.length}</Badge>
              </div>

              <div className="divide-y divide-slate-700/50">
                {ongoingSessions.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Clock size={40} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">暂无进行中的场次</p>
                  </div>
                ) : (
                  ongoingSessions.map((session) => {
                    const script = getScriptById(session.scriptId);
                    const room = getRoomById(session.roomId);

                    return (
                      <div key={session.id} className="px-6 py-3 hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">
                            {script?.name || '未知剧本'}
                          </p>
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            进行中
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {room?.name || '未知房间'}
                          </span>
                          <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <DoorOpen size={18} className="text-amber-400" />
                <h2 className="text-lg font-semibold text-white">房间状态</h2>
                <Badge variant="warning">{freeNowRooms.length} 空闲</Badge>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2">
                {rooms.map((room) => {
                  const isOccupied = occupiedRoomIds.includes(room.id);
                  const isAvailable = room.status === 'available';

                  return (
                    <div
                      key={room.id}
                      className={cn(
                        'px-3 py-2 rounded-lg border text-center',
                        isAvailable && !isOccupied && 'bg-emerald-500/10 border-emerald-700/50',
                        isAvailable && isOccupied && 'bg-rose-500/10 border-rose-700/50',
                        !isAvailable && 'bg-slate-700/30 border-slate-600/50 opacity-50'
                      )}
                    >
                      <p className="text-sm font-medium text-white">{room.name}</p>
                      <p className="text-xs mt-0.5">
                        {!isAvailable ? (
                          <span className="text-slate-500">维护中</span>
                        ) : isOccupied ? (
                          <span className="text-rose-400">使用中</span>
                        ) : (
                          <span className="text-emerald-400">空闲</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">今日数据汇总</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">总场次</span>
                  <span className="text-white font-semibold">{todaySessions.length} 场</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">服务玩家</span>
                  <span className="text-white font-semibold">{totalPlayers} 人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">已完成</span>
                  <span className="text-emerald-400 font-semibold">
                    {todaySessions.filter((s) => s.status === 'completed').length} 场
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">待开场</span>
                  <span className="text-amber-400 font-semibold">
                    {todaySessions.filter((s) => s.status === 'scheduled').length} 场
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">今日营收</span>
                    <span className="text-2xl font-bold text-indigo-400">¥{totalRevenue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
