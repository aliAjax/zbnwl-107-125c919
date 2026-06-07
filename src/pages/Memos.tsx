import { useState } from 'react';
import { Plus, Check, Trash2, Clock, Home, Package, User, Users, MoreHorizontal } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useMemoStore } from '@/store/useMemoStore';
import type { Memo, MemoStatus, MemoCategory } from '@/types';
import { cn } from '@/lib/utils';

const statusFilters: { value: MemoStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'completed', label: '已完成' }
];

const categoryOptions: { value: MemoCategory; label: string; icon: typeof Home }[] = [
  { value: 'room', label: '房间打扫', icon: Home },
  { value: 'props', label: '道具补充', icon: Package },
  { value: 'host', label: '主持人请假', icon: User },
  { value: 'customer', label: '客户回访', icon: Users },
  { value: 'other', label: '其他事项', icon: MoreHorizontal }
];

const categoryBadgeVariant: Record<MemoCategory, 'info' | 'warning' | 'danger' | 'success' | 'default'> = {
  room: 'info',
  props: 'warning',
  host: 'danger',
  customer: 'success',
  other: 'default'
};

export default function Memos() {
  const [statusFilter, setStatusFilter] = useState<MemoStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Memo, 'id' | 'createdAt' | 'status'>>({
    title: '',
    content: '',
    category: 'other'
  });

  const memos = useMemoStore((s) => s.memos);
  const addMemo = useMemoStore((s) => s.addMemo);
  const deleteMemo = useMemoStore((s) => s.deleteMemo);
  const toggleMemoStatus = useMemoStore((s) => s.toggleMemoStatus);

  const filteredMemos = memos.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const pendingCount = memos.filter((m) => m.status === 'pending').length;
  const completedCount = memos.filter((m) => m.status === 'completed').length;

  const handleOpenModal = () => {
    setFormData({
      title: '',
      content: '',
      category: 'other'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addMemo(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条备忘录吗？')) {
      deleteMemo(id);
    }
  };

  const getCategoryInfo = (category: MemoCategory) => {
    return categoryOptions.find((c) => c.value === category) || categoryOptions[4];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">门店备忘录</h1>
            <p className="text-slate-400">记录门店日常运营临时事项</p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus size={18} />
            新建备忘录
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  statusFilter === filter.value
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {filter.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-700/50">
                  {filter.value === 'all'
                    ? memos.length
                    : filter.value === 'pending'
                    ? pendingCount
                    : completedCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredMemos.length > 0 ? (
          <div className="space-y-3">
            {filteredMemos.map((memo) => {
              const categoryInfo = getCategoryInfo(memo.category);
              const CategoryIcon = categoryInfo.icon;
              return (
                <div
                  key={memo.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200',
                    memo.status === 'completed'
                      ? 'bg-slate-800/30 border-slate-700/30'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleMemoStatus(memo.id)}
                      className={cn(
                        'mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                        memo.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-500 hover:border-emerald-400'
                      )}
                    >
                      {memo.status === 'completed' && <Check size={14} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className={cn(
                            'font-medium text-base',
                            memo.status === 'completed'
                              ? 'text-slate-500 line-through'
                              : 'text-white'
                          )}
                        >
                          {memo.title}
                        </h3>
                        <Badge variant={categoryBadgeVariant[memo.category]}>
                          <CategoryIcon size={12} className="mr-1" />
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      {memo.content && (
                        <p
                          className={cn(
                            'text-sm mb-2',
                            memo.status === 'completed' ? 'text-slate-500' : 'text-slate-400'
                          )}
                        >
                          {memo.content}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          创建于 {formatDate(memo.createdAt)}
                        </span>
                        {memo.completedAt && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Check size={12} />
                            完成于 {formatDate(memo.completedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(memo.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无备忘录</p>
            <p className="text-sm">点击上方按钮创建第一条备忘录</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新建备忘录">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入备忘录标题"
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">分类</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: option.value })}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                      formData.category === option.value
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    )}
                  >
                    <OptionIcon size={16} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">详细内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="请输入详细内容（可选）"
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 hover:border-slate-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">创建备忘录</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
