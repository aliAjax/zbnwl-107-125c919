import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { HostCard } from '@/components/management/HostCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useHostStore } from '@/store/useHostStore';
import { useScriptTypeStore } from '@/store/useScriptTypeStore';
import type { Host } from '@/types';

export default function Hosts() {
  const allSpecialties = useScriptTypeStore((s) => s.getTypeNames());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [formData, setFormData] = useState<Partial<Host>>({
    name: '',
    phone: '',
    specialty: []
  });

  const hosts = useHostStore((s) => s.hosts);
  const addHost = useHostStore((s) => s.addHost);
  const updateHost = useHostStore((s) => s.updateHost);
  const deleteHost = useHostStore((s) => s.deleteHost);

  const filteredHosts = hosts.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone.includes(searchQuery)
  );

  const handleOpenModal = (host?: Host) => {
    if (host) {
      setEditingHost(host);
      setFormData(host);
    } else {
      setEditingHost(null);
      setFormData({
        name: '',
        phone: '',
        specialty: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = formData.specialty || [];
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter((s) => s !== specialty)
      : [...currentSpecialties, specialty];
    setFormData({ ...formData, specialty: newSpecialties });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHost) {
      updateHost(editingHost.id, formData);
    } else {
      addHost(formData as Omit<Host, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个主持人吗？')) {
      deleteHost(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">主持人管理</h1>
            <p className="text-slate-400">管理门店所有主持人信息</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加主持人
          </Button>
        </div>

        <div className="max-w-md">
          <Input
            placeholder="搜索主持人姓名或电话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredHosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHosts.map((host) => (
              <HostCard
                key={host.id}
                host={host}
                onEdit={() => handleOpenModal(host)}
                onDelete={() => handleDelete(host.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无主持人</p>
            <p className="text-sm">点击上方按钮添加第一个主持人</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHost ? '编辑主持人' : '添加主持人'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="主持人姓名"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名"
              required
            />
            <Input
              label="联系电话"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">擅长类型</label>
            <div className="flex flex-wrap gap-2">
              {allSpecialties.map((specialty) => (
                <label
                  key={specialty}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm ${
                    (formData.specialty || []).includes(specialty)
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.specialty || []).includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                    className="sr-only"
                  />
                  <span>{specialty}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingHost ? '保存修改' : '添加主持人'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
