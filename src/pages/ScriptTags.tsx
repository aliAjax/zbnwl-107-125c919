import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ScriptTagCard } from '@/components/management/ScriptTagCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useScriptTagStore } from '@/store/useScriptTagStore';
import type { ScriptTag } from '@/types';

const colorPresets = [
  '#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#a855f7',
  '#ec4899', '#06b6d4', '#64748b', '#ef4444', '#8b5cf6'
];

export default function ScriptTags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ScriptTag | null>(null);
  const [formData, setFormData] = useState<Partial<ScriptTag>>({
    name: '',
    color: '#3b82f6',
    description: ''
  });

  const scriptTags = useScriptTagStore((s) => s.scriptTags);
  const addScriptTag = useScriptTagStore((s) => s.addScriptTag);
  const updateScriptTag = useScriptTagStore((s) => s.updateScriptTag);
  const deleteScriptTag = useScriptTagStore((s) => s.deleteScriptTag);

  const filteredTags = scriptTags.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (tag?: ScriptTag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData(tag);
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        color: '#3b82f6',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      updateScriptTag(editingTag.id, formData);
    } else {
      addScriptTag(formData as Omit<ScriptTag, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个标签吗？删除后相关剧本的标签可能需要重新设置。')) {
      deleteScriptTag(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">剧本标签管理</h1>
            <p className="text-slate-400">管理剧本常用标签，如新手友好、强推理等</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加标签
          </Button>
        </div>

        <div className="max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索标签名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <ScriptTagCard
                key={tag.id}
                scriptTag={tag}
                onEdit={() => handleOpenModal(tag)}
                onDelete={() => handleDelete(tag.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无剧本标签</p>
            <p className="text-sm">点击上方按钮添加第一个标签</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTag ? '编辑剧本标签' : '添加剧本标签'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="标签名称"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入标签名称，如：新手友好、强推理等"
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">标签颜色</label>
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
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">标签描述</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[80px] resize-y"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入标签描述（选填）..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">预览效果</label>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: formData.color }}
            >
              {formData.name || '预览标签'}
            </span>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingTag ? '保存修改' : '添加标签'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
