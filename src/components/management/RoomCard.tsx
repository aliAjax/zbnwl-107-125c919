import { Edit, Trash2, Users, Wifi, Tv, Coffee } from 'lucide-react';
import type { Room } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RoomCardProps {
  room: Room;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  available: { label: '可用', variant: 'success' },
  maintenance: { label: '维护中', variant: 'warning' },
  disabled: { label: '停用', variant: 'danger' }
};

const facilityIcons: Record<string, React.ReactNode> = {
  '空调': <span>❄️</span>,
  '音响': <span>🔊</span>,
  '投影仪': <Tv size={14} />,
  '独立卫生间': <span>🚻</span>,
  '恐怖特效设备': <span>👻</span>,
  '沙发': <span>🛋️</span>,
  '茶水区': <Coffee size={14} />,
  '桌游': <span>🎲</span>,
  '古风装饰': <span>🏮</span>,
  '汉服换装': <span>👘</span>,
  '茶具': <span>🍵</span>,
  'LED灯效': <span>💡</span>,
  '环绕音响': <span>🔈</span>,
  '电竞座椅': <span>🪑</span>,
  'WiFi': <Wifi size={14} />
};

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const status = statusConfig[room.status] || statusConfig.available;

  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white font-display mb-1">
            {room.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <Users size={14} />
              <span>最多{room.capacity}人</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            onClick={onEdit}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-8 h-8 p-0"
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {room.facilities.map((facility, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300"
          >
            {facilityIcons[facility] || <span>•</span>}
            <span>{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
