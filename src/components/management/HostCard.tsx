import { Edit, Trash2, Phone, Star } from 'lucide-react';
import type { Host } from '@/types';
import { Button } from '@/components/ui/Button';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';

interface HostCardProps {
  host: Host;
  onEdit: () => void;
  onDelete: () => void;
}

export function HostCard({ host, onEdit, onDelete }: HostCardProps) {
  const getTypeName = useScriptTypeStore((s) => s.getTypeName);
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          {host.avatar ? (
            <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-semibold text-white">{host.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white font-display">
                {host.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                <Phone size={14} />
                <span>{host.phone}</span>
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
          <div className="flex flex-wrap gap-1.5 mt-3">
            {host.specialty.map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs"
              >
                <Star size={10} className="fill-indigo-400" />
                {getTypeName(spec)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
