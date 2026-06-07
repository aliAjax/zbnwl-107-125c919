import { Edit, Trash2, Tag } from 'lucide-react';
import type { ScriptTag } from '@/types';
import { Button } from '@/components/ui/Button';

interface ScriptTagCardProps {
  scriptTag: ScriptTag;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScriptTagCard({ scriptTag, onEdit, onDelete }: ScriptTagCardProps) {
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: scriptTag.color }}
        >
          <Tag size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white font-display">
                {scriptTag.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: scriptTag.color }}
                >
                  {scriptTag.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">{scriptTag.color}</span>
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
          {scriptTag.description && (
            <p className="mt-3 text-sm text-slate-400 line-clamp-2">
              {scriptTag.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
