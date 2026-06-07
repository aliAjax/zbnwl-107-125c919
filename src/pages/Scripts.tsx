import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ScriptCard } from '@/components/management/ScriptCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useScriptStore } from '@/store/useScriptStore';
import type { Script } from '@/types';

export default function Scripts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [formData, setFormData] = useState<Partial<Script>>({
    name: '',
    type: '推理',
    difficulty: 3,
    duration: 180,
    minPlayers: 4,
    maxPlayers: 6,
    description: ''
  });

  const scripts = useScriptStore((s) => s.scripts);
  const addScript = useScriptStore((s) => s.addScript);
  const updateScript = useScriptStore((s) => s.updateScript);
  const deleteScript = useScriptStore((s) => s.deleteScript);

  const filteredScripts = scripts.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.includes(searchQuery)
  );

  const handleOpenModal = (script?: Script) => {
    if (script) {
      setEditingScript(script);
      setFormData(script);
    } else {
      setEditingScript(null);
      setFormData({
        name: '',
        type: '推理',
        difficulty: 3,
        duration: 180,
        minPlayers: 4,
        maxPlayers: 6,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScript) {
      updateScript(editingScript.id, formData);
    } else {
      addScript(formData as Omit<Script, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个剧本吗？')) {
      deleteScript(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">剧本管理</h1>
            <p className="text-slate-400">管理门店所有剧本信息</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加剧本
          </Button>
        </div>

        <div className="max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索剧本名称或类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredScripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={() => handleOpenModal(script)}
                onDelete={() => handleDelete(script.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无剧本</p>
            <p className="text-sm">点击上方按钮添加第一个剧本</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingScript ? '编辑剧本' : '添加剧本'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="剧本名称"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入剧本名称"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="剧本类型"
              value={formData.type || '推理'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Script['type'] })}
              options={[
                { value: '恐怖', label: '恐怖' },
                { value: '情感', label: '情感' },
                { value: '推理', label: '推理' },
                { value: '欢乐', label: '欢乐' },
                { value: '阵营', label: '阵营' },
                { value: '其他', label: '其他' }
              ]}
            />
            <Select
              label="难度等级"
              value={String(formData.difficulty || 3)}
              onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) as Script['difficulty'] })}
              options={[
                { value: '1', label: '⭐ 简单' },
                { value: '2', label: '⭐⭐ 入门' },
                { value: '3', label: '⭐⭐⭐ 中等' },
                { value: '4', label: '⭐⭐⭐⭐ 困难' },
                { value: '5', label: '⭐⭐⭐⭐⭐ 烧脑' }
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="时长(分钟)"
              type="number"
              value={formData.duration || 180}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              min={30}
              required
            />
            <Input
              label="最少人数"
              type="number"
              value={formData.minPlayers || 4}
              onChange={(e) => setFormData({ ...formData, minPlayers: Number(e.target.value) })}
              min={1}
              required
            />
            <Input
              label="最多人数"
              type="number"
              value={formData.maxPlayers || 6}
              onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">剧本描述</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入剧本简介..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingScript ? '保存修改' : '添加剧本'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
