import { useState } from 'react';
import { Plus, Search, Heart } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CustomerCard } from '@/components/management/CustomerCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCustomerStore } from '@/store/useCustomerStore';
import type { Customer } from '@/types';

const allTypes = ['恐怖', '情感', '推理', '欢乐', '阵营', '其他'];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    favoriteTypes: [],
    notes: '',
    recentSessions: 0
  });

  const customers = useCustomerStore((s) => s.customers);
  const addCustomer = useCustomerStore((s) => s.addCustomer);
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);
  const deleteCustomer = useCustomerStore((s) => s.deleteCustomer);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        favoriteTypes: [],
        notes: '',
        recentSessions: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleFavoriteTypeToggle = (type: string) => {
    const currentTypes = formData.favoriteTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    setFormData({ ...formData, favoriteTypes: newTypes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData as Omit<Customer, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个客户吗？')) {
      deleteCustomer(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">客户管理</h1>
            <p className="text-slate-400">管理门店所有客户信息</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加客户
          </Button>
        </div>

        <div className="max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索客户姓名或电话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={() => handleOpenModal(customer)}
                onDelete={() => handleDelete(customer.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无客户</p>
            <p className="text-sm">点击上方按钮添加第一个客户</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? '编辑客户' : '添加客户'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="玩家姓名"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名"
              required
            />
            <Input
              label="手机号"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
              required
            />
          </div>
          <Input
            label="最近参与场次"
            type="number"
            value={formData.recentSessions || 0}
            onChange={(e) => setFormData({ ...formData, recentSessions: Number(e.target.value) })}
            min={0}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">常玩类型</label>
            <div className="flex flex-wrap gap-2">
              {allTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm ${
                    (formData.favoriteTypes || []).includes(type)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.favoriteTypes || []).includes(type)}
                    onChange={() => handleFavoriteTypeToggle(type)}
                    className="sr-only"
                  />
                  <Heart size={12} className={
                    (formData.favoriteTypes || []).includes(type) ? 'fill-emerald-400' : ''
                  } />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">备注</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="请输入客户备注信息..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingCustomer ? '保存修改' : '添加客户'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
