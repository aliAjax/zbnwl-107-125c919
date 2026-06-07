import { Edit, Trash2, Phone, Heart, Calendar, FileText } from 'lucide-react';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/Button';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          <span className="text-xl font-semibold text-white">{customer.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white font-display">
                {customer.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                <Phone size={14} />
                <span>{customer.phone}</span>
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
            {customer.favoriteTypes.map((type, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs"
              >
                <Heart size={10} className="fill-emerald-400" />
                {type}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Calendar size={14} className="text-indigo-400" />
              <span>最近参与 <span className="text-white font-medium">{customer.recentSessions}</span> 场</span>
            </div>
            {customer.notes && (
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <FileText size={14} className="text-amber-400" />
                <span>有备注</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
