export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type RoomStatus = 'available' | 'maintenance' | 'disabled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type BadgeVariant = 'default' | 'danger' | 'gold' | 'info' | 'success' | 'warning';

export interface ScriptType {
  id: string;
  name: string;
  color: string;
  gradientClass: string;
  badgeVariant: BadgeVariant;
}

export interface ScriptTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Script {
  id: string;
  name: string;
  type: string;
  difficulty: Difficulty;
  duration: number;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  coverImage?: string;
  tags: string[];
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

export interface Customer {
  id: string;
  name: string;
  phone: string;
  favoriteTypes: string[];
  notes: string;
  recentSessions: number;
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
export type MemoStatus = 'pending' | 'completed';
export type MemoCategory = 'room' | 'props' | 'host' | 'customer' | 'other';

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: MemoCategory;
  status: MemoStatus;
  createdAt: string;
  completedAt?: string;
}
