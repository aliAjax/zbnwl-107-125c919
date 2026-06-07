import type { Session } from '@/types';
import { addHours, setHours, setMinutes, startOfToday, addDays } from 'date-fns';

const today = startOfToday();

export const mockSessions: Session[] = [
  {
    id: 'session-1',
    scriptId: 'script-1',
    roomId: 'room-1',
    hostId: 'host-1',
    startTime: setMinutes(setHours(addHours(today, 2), 14), 0).toISOString(),
    endTime: setMinutes(setHours(addHours(today, 2), 18), 0).toISOString(),
    playerCount: 6,
    paidAmount: 720,
    paymentStatus: 'paid',
    status: 'scheduled',
    notes: '老客户，提前到'
  },
  {
    id: 'session-2',
    scriptId: 'script-2',
    roomId: 'room-2',
    hostId: 'host-4',
    startTime: setMinutes(setHours(addHours(today, 0), 19), 0).toISOString(),
    endTime: setMinutes(setHours(addHours(today, 0), 22), 0).toISOString(),
    playerCount: 5,
    paidAmount: 300,
    paymentStatus: 'partial',
    status: 'scheduled'
  },
  {
    id: 'session-3',
    scriptId: 'script-4',
    roomId: 'room-3',
    hostId: 'host-2',
    startTime: setMinutes(setHours(addHours(today, 0), 10), 0).toISOString(),
    endTime: setMinutes(setHours(addHours(today, 0), 12), 30).toISOString(),
    playerCount: 8,
    paidAmount: 960,
    paymentStatus: 'paid',
    status: 'completed'
  },
  {
    id: 'session-4',
    scriptId: 'script-3',
    roomId: 'room-1',
    hostId: 'host-2',
    startTime: setMinutes(setHours(addDays(today, 1), 15), 0).toISOString(),
    endTime: setMinutes(setHours(addDays(today, 1), 18), 30).toISOString(),
    playerCount: 7,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    status: 'scheduled'
  },
  {
    id: 'session-5',
    scriptId: 'script-5',
    roomId: 'room-5',
    hostId: 'host-3',
    startTime: setMinutes(setHours(addDays(today, 1), 13), 0).toISOString(),
    endTime: setMinutes(setHours(addDays(today, 1), 18), 0).toISOString(),
    playerCount: 10,
    paidAmount: 1200,
    paymentStatus: 'paid',
    status: 'scheduled',
    notes: '团建活动，10人'
  },
  {
    id: 'session-6',
    scriptId: 'script-6',
    roomId: 'room-5',
    hostId: 'host-1',
    startTime: setMinutes(setHours(addDays(today, 2), 14), 0).toISOString(),
    endTime: setMinutes(setHours(addDays(today, 2), 18), 0).toISOString(),
    playerCount: 6,
    paidAmount: 720,
    paymentStatus: 'paid',
    status: 'scheduled'
  },
  {
    id: 'session-7',
    scriptId: 'script-2',
    roomId: 'room-2',
    hostId: 'host-4',
    startTime: setMinutes(setHours(addDays(today, 2), 20), 0).toISOString(),
    endTime: setMinutes(setHours(addDays(today, 2), 23), 0).toISOString(),
    playerCount: 4,
    paidAmount: 200,
    paymentStatus: 'partial',
    status: 'scheduled'
  }
];
