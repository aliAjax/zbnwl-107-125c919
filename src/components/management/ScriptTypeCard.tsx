import { Edit, Trash2, Palette } from 'lucide-react';
import type { ScriptType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ScriptTypeCardProps {
  scriptType: ScriptType;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScriptTypeCard({ scriptType, onEdit, onDelete }: ScriptTypeCardProps) {
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br"
          style={{ background: `linear-gradient(135deg, ${scriptType.color}, ${scriptType.color}dd)` }}
        >
          <Palette size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white font-display">
                {scriptType.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={scriptType.badgeVariant}>
                  {scriptType.name}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">{scriptType.color}</span>
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
          <div className="mt-3">
            <div className="text-xs text-slate-400 mb-1">渐变样式</div>
            <div className={`h-6 rounded-lg bg-gradient-to-r ${scriptType.gradientClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
