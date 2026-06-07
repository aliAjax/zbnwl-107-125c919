export type ScriptType = '恐怖' | '情感' | '推理' | '欢乐' | '阵营' | '其他';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type RoomStatus = 'available' | 'maintenance' | 'disabled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Script {
  id: string;
  name: string;
  type: ScriptType;
  difficulty: Difficulty;
  duration: number;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  coverImage?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: RoomStatus;
}

export interface Host {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  specialty: string[];
}

export interface Session {
  id: string;
  scriptId: string;
  roomId: string;
  hostId: string;
  startTime: string;
  endTime: string;
  playerCount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  status: SessionStatus;
  notes?: string;
}

export interface ConflictInfo {
  type: 'room' | 'host' | 'script';
  message: string;
  conflictingSession?: Session;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: ConflictInfo[];
}

export type ViewMode = 'day' | 'week' | 'month';
