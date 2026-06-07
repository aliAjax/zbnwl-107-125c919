import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Modal } from '@/components/ui/Modal';
import { SessionForm } from '@/components/session/SessionForm';
import { useScriptStore } from '@/store/useScriptStore';
import { useRoomStore } from '@/store/useRoomStore';
import { useHostStore } from '@/store/useHostStore';
import { useSessionStore } from '@/store/useSessionStore';
import type { Session } from '@/types';
import { CalendarDays, Clock, Users, DollarSign } from 'lucide-react';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [presetDate, setPresetDate] = useState<Date | undefined>(undefined);

  const scripts = useScriptStore((s) => s.scripts);
  const rooms = useRoomStore((s) => s.rooms);
  const hosts = useHostStore((s) => s.hosts);
  const sessions = useSessionStore((s) => s.sessions);
  const addSession = useSessionStore((s) => s.addSession);
  const updateSession = useSessionStore((s) => s.updateSession);

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return sessionDate >= today && sessionDate < tomorrow;
  });

  const stats = {
    total: todaySessions.length,
    scheduled: todaySessions.filter((s) => s.status === 'scheduled').length,
    ongoing: todaySessions.filter((s) => s.status === 'ongoing').length,
    completed: todaySessions.filter((s) => s.status === 'completed').length
  };

  const handleNewSession = (date?: Date) => {
    setEditingSession(null);
    setPresetDate(date);
    setIsModalOpen(true);
  };

  const handleSessionClick = (session: Session) => {
    setEditingSession(session);
    setPresetDate(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<Session, 'id'>) => {
    if (editingSession) {
      updateSession(editingSession.id, data);
    } else {
      addSession(data);
    }
    setIsModalOpen(false);
    setEditingSession(null);
    setPresetDate(undefined);
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white font-display mb-1">排期日历</h1>
          <p className="text-slate-400">管理和查看所有场次安排</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <CalendarDays size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-slate-400">今日场次</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
                <p className="text-sm text-slate-400">待开场</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.ongoing}</p>
                <p className="text-sm text-slate-400">进行中</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <DollarSign size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">¥{todaySessions.reduce((sum, s) => sum + s.paidAmount, 0)}</p>
                <p className="text-sm text-slate-400">今日营收</p>
              </div>
            </div>
          </div>
        </div>

        <CalendarView
          sessions={sessions}
          scripts={scripts}
          rooms={rooms}
          hosts={hosts}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onSessionClick={handleSessionClick}
          onNewSession={handleNewSession}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        title={editingSession ? '编辑场次' : '新建场次'}
      >
        <SessionForm
          initialData={editingSession || undefined}
          presetDate={presetDate}
          scripts={scripts}
          rooms={rooms}
          hosts={hosts}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSession(null);
            setPresetDate(undefined);
          }}
        />
      </Modal>
    </PageLayout>
  );
}
