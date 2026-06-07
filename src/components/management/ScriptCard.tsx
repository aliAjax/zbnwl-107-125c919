import { Edit, Trash2, Clock, Users, Star } from 'lucide-react';
import type { Script } from '@/types';
import { formatDurationMinutes } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';

interface ScriptCardProps {
  script: Script;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScriptCard({ script, onEdit, onDelete }: ScriptCardProps) {
  const getScriptTypeByName = useScriptTypeStore((s) => s.getScriptTypeByName);
  const scriptType = getScriptTypeByName(script.type);
  const badgeVariant = scriptType?.badgeVariant || 'default';
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="aspect-video relative overflow-hidden">
        {script.coverImage ? (
          <img
            src={script.coverImage}
            alt={script.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-4xl text-slate-600">🎭</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={badgeVariant}>
            {script.type}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-8 h-8 p-0"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white font-display mb-2">
          {script.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDurationMinutes(script.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{script.minPlayers}-{script.maxPlayers}人</span>
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < script.difficulty ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2">
          {script.description}
        </p>
      </div>
    </div>
  );
}
