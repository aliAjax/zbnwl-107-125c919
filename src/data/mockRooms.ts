import type { Room } from '@/types';

export const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: '迷雾剧场',
    capacity: 8,
    facilities: ['空调', '音响', '投影仪', '独立卫生间'],
    status: 'available'
  },
  {
    id: 'room-2',
    name: '古宅惊魂',
    capacity: 6,
    facilities: ['空调', '音响', '恐怖特效设备'],
    status: 'available'
  },
  {
    id: 'room-3',
    name: '温馨小屋',
    capacity: 10,
    facilities: ['空调', '沙发', '茶水区', '桌游'],
    status: 'available'
  },
  {
    id: 'room-4',
    name: '古风雅集',
    capacity: 12,
    facilities: ['空调', '古风装饰', '汉服换装', '茶具'],
    status: 'maintenance'
  },
  {
    id: 'room-5',
    name: '科幻舱',
    capacity: 7,
    facilities: ['空调', 'LED灯效', '环绕音响', '电竞座椅'],
    status: 'available'
  }
];
