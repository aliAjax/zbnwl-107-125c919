import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ScriptTypeCard } from '@/components/management/ScriptTypeCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';
import type { ScriptType, BadgeVariant } from '@/types';

const badgeVariants: { value: BadgeVariant; label: string }[] = [
  { value: 'default', label: '默认' },
  { value: 'danger', label: '危险/红色' },
  { value: 'gold', label: '金色' },
  { value: 'info', label: '信息/蓝色' },
  { value: 'success', label: '成功/绿色' },
  { value: 'warning', label: '警告/紫色' }
];

const gradientPresets = [
  { value: 'from-rose-600 to-red-700', label: '红色系' },
  { value: 'from-amber-500 to-orange-600', label: '橙色系' },
  { value: 'from-blue-500 to-indigo-600', label: '蓝色系' },
  { value: 'from-emerald-500 to-green-600', label: '绿色系' },
  { value: 'from-purple-500 to-violet-600', label: '紫色系' },
  { value: 'from-pink-500 to-rose-600', label: '粉色系' },
  { value: 'from-cyan-500 to-blue-600', label: '青色系' },
  { value: 'from-slate-500 to-slate-600', label: '灰色系' }
];

const colorPresets = [
  '#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#a855f7',
  '#ec4899', '#06b6d4', '#64748b', '#ef4444', '#8b5cf6'
];

export default function ScriptTypes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ScriptType | null>(null);
  const [formData, setFormData] = useState<Partial<ScriptType>>({
    name: '',
    color: '#3b82f6',
    gradientClass: 'from-blue-500 to-indigo-600',
    badgeVariant: 'info'
  });

  const scriptTypes = useScriptTypeStore((s) => s.scriptTypes);
  const addScriptType = useScriptTypeStore((s) => s.addScriptType);
  const updateScriptType = useScriptTypeStore((s) => s.updateScriptType);
  const deleteScriptType = useScriptTypeStore((s) => s.deleteScriptType);

  const filteredTypes = scriptTypes.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (type?: ScriptType) => {
    if (type) {
      setEditingType(type);
      setFormData(type);
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        color: '#3b82f6',
        gradientClass: 'from-blue-500 to-indigo-600',
        badgeVariant: 'info'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateScriptType(editingType.id, formData);
    } else {
      addScriptType(formData as Omit<ScriptType, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个剧本类型吗？删除后相关剧本的类型可能需要重新设置。')) {
      deleteScriptType(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">剧本类型管理</h1>
            <p className="text-slate-400">管理剧本分类和颜色样式</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加类型
          </Button>
        </div>

        <div className="max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索类型名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTypes.map((type) => (
              <ScriptTypeCard
                key={type.id}
                scriptType={type}
                onEdit={() => handleOpenModal(type)}
                onDelete={() => handleDelete(type.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无剧本类型</p>
            <p className="text-sm">点击上方按钮添加第一个类型</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? '编辑剧本类型' : '添加剧本类型'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="类型名称"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入类型名称，如：恐怖、情感等"
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">主题颜色</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
            <Input
              value={formData.color || ''}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="或输入自定义颜色代码，如：#ff0000"
            />
          </div>
          <Select
            label="徽章样式"
            value={formData.badgeVariant || 'info'}
            onChange={(e) => setFormData({ ...formData, badgeVariant: e.target.value as BadgeVariant })}
            options={badgeVariants}
          />
          <Select
            label="渐变样式"
            value={formData.gradientClass || 'from-blue-500 to-indigo-600'}
            onChange={(e) => setFormData({ ...formData, gradientClass: e.target.value })}
            options={gradientPresets}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">预览效果</label>
            <div className={`h-12 rounded-lg bg-gradient-to-r ${formData.gradientClass} flex items-center justify-center text-white font-medium`}>
              {formData.name || '预览文字'}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingType ? '保存修改' : '添加类型'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
