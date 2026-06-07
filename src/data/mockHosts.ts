import type { Host } from '@/types';

export const mockHosts: Host[] = [
  {
    id: 'host-1',
    name: '阿杰',
    phone: '138****1234',
    specialty: ['恐怖', '推理', '阵营'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host1'
  },
  {
    id: 'host-2',
    name: '小雨',
    phone: '139****5678',
    specialty: ['情感', '欢乐'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host2'
  },
  {
    id: 'host-3',
    name: '老王',
    phone: '137****9012',
    specialty: ['推理', '阵营'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host3'
  },
  {
    id: 'host-4',
    name: '小樱',
    phone: '136****3456',
    specialty: ['情感', '恐怖', '欢乐'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host4'
  }
];
