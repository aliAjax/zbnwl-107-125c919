import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Clock, Users, DollarSign } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import type { Session, Script, Room, Host, ConflictResult } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { checkConflicts } from '@/utils/conflictUtils';
import { formatDurationMinutes } from '@/utils/dateUtils';
import { useSessionStore } from '@/store/useSessionStore';
import { cn } from '@/lib/utils';

interface SessionFormProps {
  initialData?: Session;
  scripts: Script[];
  rooms: Room[];
  hosts: Host[];
  onSubmit: (data: Omit<Session, 'id'>) => void;
  onCancel: () => void;
}

export function SessionForm({ initialData, scripts, rooms, hosts, onSubmit, onCancel }: SessionFormProps) {
  const sessions = useSessionStore((s) => s.sessions);

  const [formData, setFormData] = useState({
    scriptId: initialData?.scriptId || '',
    roomId: initialData?.roomId || '',
    hostId: initialData?.hostId || '',
    startTime: initialData?.startTime
      ? format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    playerCount: initialData?.playerCount || 0,
    paidAmount: initialData?.paidAmount || 0,
    paymentStatus: initialData?.paymentStatus || 'unpaid' as const,
    status: initialData?.status || 'scheduled' as const,
    notes: initialData?.notes || ''
  });

  const selectedScript = useMemo(
    () => scripts.find((s) => s.id === formData.scriptId),
    [scripts, formData.scriptId]
  );

  const endTime = useMemo(() => {
    if (!formData.startTime || !selectedScript) return null;
    return addMinutes(new Date(formData.startTime), selectedScript.duration);
  }, [formData.startTime, selectedScript]);

  const conflicts: ConflictResult = useMemo(() => {
    if (!formData.scriptId || !formData.roomId || !formData.hostId || !formData.startTime || !endTime) {
      return { hasConflict: false, conflicts: [] };
    }
    return checkConflicts(
      {
        scriptId: formData.scriptId,
        roomId: formData.roomId,
        hostId: formData.hostId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: endTime.toISOString()
      },
      sessions,
      initialData?.id
    );
  }, [formData.scriptId, formData.roomId, formData.hostId, formData.startTime, endTime, sessions, initialData?.id]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScript || !endTime) return;
    if (conflicts.hasConflict) return;

    onSubmit({
      scriptId: formData.scriptId,
      roomId: formData.roomId,
      hostId: formData.hostId,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: endTime.toISOString(),
      playerCount: Number(formData.playerCount),
      paidAmount: Number(formData.paidAmount),
      paymentStatus: formData.paymentStatus,
      status: formData.status,
      notes: formData.notes
    });
  };

  const scriptOptions = scripts.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.type}, ${formatDurationMinutes(s.duration)})`
  }));

  const roomOptions = rooms
    .filter((r) => r.status === 'available')
    .map((r) => ({
      value: r.id,
      label: `${r.name} (最多${r.capacity}人)`
    }));

  const hostOptions = hosts.map((h) => ({
    value: h.id,
    label: h.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="选择剧本"
          name="scriptId"
          value={formData.scriptId}
          onChange={(e) => handleChange('scriptId', e.target.value)}
          options={[{ value: '', label: '请选择剧本' }, ...scriptOptions]}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-300">剧本信息</label>
          <div className="px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm">
            {selectedScript ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="info">{selectedScript.type}</Badge>
                  <span className="text-slate-400">
                    <Clock size={12} className="inline mr-1" />
                    {formatDurationMinutes(selectedScript.duration)}
                  </span>
                </div>
                <div className="text-slate-400">
                  <Users size={12} className="inline mr-1" />
                  {selectedScript.minPlayers}-{selectedScript.maxPlayers}人
                </div>
              </div>
            ) : (
              <span className="text-slate-500">请先选择剧本</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="选择房间"
          name="roomId"
          value={formData.roomId}
          onChange={(e) => handleChange('roomId', e.target.value)}
          options={[{ value: '', label: '请选择房间' }, ...roomOptions]}
        />
        <Select
          label="选择主持人"
          name="hostId"
          value={formData.hostId}
          onChange={(e) => handleChange('hostId', e.target.value)}
          options={[{ value: '', label: '请选择主持人' }, ...hostOptions]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="开场时间"
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => handleChange('startTime', e.target.value)}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-300">预计结束</label>
          <div className="px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-slate-300">
            {endTime ? format(endTime, 'yyyy-MM-dd HH:mm') : '-'}
          </div>
        </div>
      </div>

      {conflicts.hasConflict && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 animate-pulse-slow">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-rose-400 font-medium mb-2">检测到时间冲突</h4>
              <ul className="space-y-1 text-sm text-rose-300">
                {conflicts.conflicts.map((c, idx) => (
                  <li key={idx}>• {c.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="玩家人数"
          name="playerCount"
          type="number"
          min={0}
          value={formData.playerCount}
          onChange={(e) => handleChange('playerCount', e.target.value)}
        />
        <Input
          label="已付金额"
          name="paidAmount"
          type="number"
          min={0}
          value={formData.paidAmount}
          onChange={(e) => handleChange('paidAmount', e.target.value)}
        />
        <Select
          label="付款状态"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={(e) => handleChange('paymentStatus', e.target.value)}
          options={[
            { value: 'unpaid', label: '未付款' },
            { value: 'partial', label: '部分付款' },
            { value: 'paid', label: '已付款' }
          ]}
        />
      </div>

      <Select
        label="场次状态"
        name="status"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
        options={[
          { value: 'scheduled', label: '待开场' },
          { value: 'ongoing', label: '进行中' },
          { value: 'completed', label: '已完成' },
          { value: 'cancelled', label: '已取消' }
        ]}
      />

      <Input
        label="备注"
        name="notes"
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        placeholder="可选，输入备注信息..."
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button
          type="submit"
          disabled={
            !formData.scriptId ||
            !formData.roomId ||
            !formData.hostId ||
            !formData.startTime ||
            conflicts.hasConflict
          }
        >
          {initialData ? '保存修改' : '创建场次'}
        </Button>
      </div>
    </form>
  );
}
