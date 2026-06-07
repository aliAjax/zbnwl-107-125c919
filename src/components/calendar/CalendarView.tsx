import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  format
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Session, Script, Room, Host } from '@/types';
import { SessionCard } from './SessionCard';
import { Button } from '@/components/ui/Button';
import { getWeekDates } from '@/utils/dateUtils';

interface CalendarViewProps {
  sessions: Session[];
  scripts: Script[];
  rooms: Room[];
  hosts: Host[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSessionClick: (session: Session) => void;
  onNewSession: (date?: Date) => void;
}

export function CalendarView({
  sessions,
  scripts,
  rooms,
  hosts,
  selectedDate,
  onDateChange,
  onSessionClick,
  onNewSession
}: CalendarViewProps) {
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const sessionsByDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    sessions.forEach((s) => {
      const dateKey = format(new Date(s.startTime), 'yyyy-MM-dd');
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(s);
    });
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });
    return map;
  }, [sessions]);

  const getScript = (id: string) => scripts.find((s) => s.id === id);
  const getRoom = (id: string) => rooms.find((r) => r.id === id);
  const getHost = (id: string) => hosts.find((h) => h.id === id);

  const goPrevWeek = () => onDateChange(addWeeks(selectedDate, -1));
  const goNextWeek = () => onDateChange(addWeeks(selectedDate, 1));

  return (
    <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goPrevWeek} className="w-9 h-9 p-0">
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-white font-display">
              {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy年MM月dd日', { locale: zhCN })}
              {' - '}
              {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'MM月dd日', { locale: zhCN })}
            </h3>
            <p className="text-sm text-slate-400">本周排期</p>
          </div>
          <Button variant="ghost" size="sm" onClick={goNextWeek} className="w-9 h-9 p-0">
            <ChevronRight size={20} />
          </Button>
        </div>
        <Button onClick={() => onNewSession(selectedDate)}>
          <Plus size={18} />
          新建场次
        </Button>
      </div>

      <div className="grid grid-cols-7">
        {weekDates.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const daySessions = sessionsByDate[dateKey] || [];
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={dateKey}
              className={`min-h-[500px] border-r border-slate-700/30 last:border-r-0 cursor-pointer transition-colors ${
                isSelected ? 'bg-indigo-500/5' : 'hover:bg-slate-700/20'
              }`}
              onClick={() => onDateChange(date)}
            >
              <div
                className={`sticky top-0 z-10 p-3 text-center border-b border-slate-700/30 ${
                  isSelected ? 'bg-indigo-500/10' : 'bg-slate-800/80'
                }`}
              >
                <div className="text-xs text-slate-400 mb-1">
                  {format(date, 'EEEE', { locale: zhCN })}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isCurrentDay
                      ? 'text-indigo-400'
                      : isSelected
                      ? 'text-white'
                      : 'text-slate-300'
                  }`}
                >
                  {format(date, 'd')}
                </div>
                {isCurrentDay && (
                  <div className="mt-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                )}
              </div>

              <div className="p-2 space-y-2">
                {daySessions.map((session) => (
                  <div key={session.id} onClick={(e) => { e.stopPropagation(); onSessionClick(session); }}>
                    <SessionCard
                      session={session}
                      script={getScript(session.scriptId)}
                      room={getRoom(session.roomId)}
                      host={getHost(session.hostId)}
                    />
                  </div>
                ))}
                {daySessions.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    暂无场次
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
