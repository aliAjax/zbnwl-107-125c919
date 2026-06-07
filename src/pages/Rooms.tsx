import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { RoomCard } from '@/components/management/RoomCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useRoomStore } from '@/store/useRoomStore';
import type { Room } from '@/types';

const allFacilities = [
  '空调', '音响', '投影仪', '独立卫生间', '恐怖特效设备',
  '沙发', '茶水区', '桌游', '古风装饰', '汉服换装',
  '茶具', 'LED灯效', '环绕音响', '电竞座椅', 'WiFi'
];

export default function Rooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    capacity: 6,
    facilities: [],
    status: 'available'
  });

  const rooms = useRoomStore((s) => s.rooms);
  const addRoom = useRoomStore((s) => s.addRoom);
  const updateRoom = useRoomStore((s) => s.updateRoom);
  const deleteRoom = useRoomStore((s) => s.deleteRoom);

  const filteredRooms = rooms.filter(
    (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
    } else {
      setEditingRoom(null);
      setFormData({
        name: '',
        capacity: 6,
        facilities: [],
        status: 'available'
      });
    }
    setIsModalOpen(true);
  };

  const handleFacilityToggle = (facility: string) => {
    const currentFacilities = formData.facilities || [];
    const newFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter((f) => f !== facility)
      : [...currentFacilities, facility];
    setFormData({ ...formData, facilities: newFacilities });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom(formData as Omit<Room, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个房间吗？')) {
      deleteRoom(id);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display mb-1">房间管理</h1>
            <p className="text-slate-400">管理门店所有房间信息</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            添加房间
          </Button>
        </div>

        <div className="max-w-md">
          <Input
            placeholder="搜索房间名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={() => handleOpenModal(room)}
                onDelete={() => handleDelete(room.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">暂无房间</p>
            <p className="text-sm">点击上方按钮添加第一个房间</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? '编辑房间' : '添加房间'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="房间名称"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入房间名称"
              required
            />
            <Input
              label="容纳人数"
              type="number"
              value={formData.capacity || 6}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              min={1}
              required
            />
          </div>
          <Select
            label="房间状态"
            value={formData.status || 'available'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Room['status'] })}
            options={[
              { value: 'available', label: '可用' },
              { value: 'maintenance', label: '维护中' },
              { value: 'disabled', label: '停用' }
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">房间设施</label>
            <div className="grid grid-cols-3 gap-2">
              {allFacilities.map((facility) => (
                <label
                  key={facility}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    (formData.facilities || []).includes(facility)
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.facilities || []).includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="sr-only"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingRoom ? '保存修改' : '添加房间'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
