import { useState } from 'react';
import { Plus, ChevronUp, ChevronDown, Edit2, Power, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';
import type { ScriptType } from '@/types';
import { cn } from '@/lib/utils';

const colorOptions = [
  { value: 'default', label: '默认' },
  { value: 'success', label: '成功(绿)' },
  { value: 'warning', label: '警告(黄)' },
  { value: 'danger', label: '危险(红)' },
  { value: 'info', label: '信息(蓝)' },
  { value: 'gold', label: '金色(橙)' }
];

export default function ScriptTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ScriptType | null>(null);
  const [formData, setFormData] = useState({ name: '', color: 'default' });

  const scriptTypes = useScriptTypeStore((s) => s.scriptTypes);
  const addScriptType = useScriptTypeStore((s) => s.addScriptType);
  const updateScriptType = useScriptTypeStore((s) => s.updateScriptType);
  const deleteScriptType = useScriptTypeStore((s) => s.deleteScriptType);
  const toggleActive = useScriptTypeStore((s) => s.toggleActive);
  const reorder = useScriptTypeStore((s) => s.reorder);

  const sortedTypes = [...scriptTypes].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleOpenModal = (type?: ScriptType) => {
    if (type) {
      setEditingType(type);
      setFormData({ name: type.name, color: type.color || 'default' });
    } else {
      setEditingType(null);
      setFormData({ name: '', color: 'default' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateScriptType(editingType.id, { name: formData.name, color: formData.color });
    } else {
      addScriptType(formData.name, formData.color);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个类型吗？已有记录中的历史类型不会丢失展示。')) {
      deleteScriptType(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">调式资料管理</h1>
            <p className="text-slate-400">管理剧本类型，支持新增、重命名、停用和排序</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            新增类型
          </Button>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="divide-y divide-slate-700/50">
            {sortedTypes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500">暂无类型，点击上方按钮添加第一个类型</p>
              </div>
            ) : (
              sortedTypes.map((type, index) => (
                <div
                  key={type.id}
                  className={cn(
                    'px-6 py-4 flex items-center justify-between',
                    'hover:bg-slate-700/30 transition-colors',
                    !type.active && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0"
                        onClick={() => reorder(type.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0"
                        onClick={() => reorder(type.id, 'down')}
                        disabled={index === sortedTypes.length - 1}
                      >
                        <ChevronDown size={16} />
                      </Button>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{type.name}</h3>
                        {!type.active && (
                          <Badge variant="default" className="text-xs">
                            已停用
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">ID: {type.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={type.color as any || 'default'}>
                      {type.name}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-9 h-9 p-0"
                      onClick={() => toggleActive(type.id)}
                      title={type.active ? '停用' : '启用'}
                    >
                      <Power size={16} className={type.active ? 'text-emerald-400' : 'text-slate-500'} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-9 h-9 p-0"
                      onClick={() => handleOpenModal(type)}
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-9 h-9 p-0 text-rose-400 hover:text-rose-300"
                      onClick={() => handleDelete(type.id)}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
          <p className="text-sm text-slate-400">
            <span className="text-amber-400">💡 提示：</span>
            停用的类型不会出现在新建剧本的下拉选项中，但已有的历史记录中的类型仍会正常展示。
            重命名类型后，已有记录中的该类型会自动更新为新名称。
          </p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? '编辑类型' : '新增类型'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="类型名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入类型名称"
            required
          />
          <Select
            label="标签颜色"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            options={colorOptions}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {editingType ? '保存修改' : '新增类型'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
