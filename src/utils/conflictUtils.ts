import type { Session, ConflictResult, ConflictInfo } from '@/types';
import { isTimeOverlapping } from './dateUtils';

export function checkConflicts(
  newSession: Pick<Session, 'scriptId' | 'roomId' | 'hostId' | 'startTime' | 'endTime'>,
  existingSessions: Session[],
  excludeSessionId?: string
): ConflictResult {
  const conflicts: ConflictInfo[] = [];

  for (const session of existingSessions) {
    if (excludeSessionId && session.id === excludeSessionId) continue;
    if (session.status === 'cancelled') continue;

    const overlaps = isTimeOverlapping(
      newSession.startTime,
      newSession.endTime,
      session.startTime,
      session.endTime
    );

    if (!overlaps) continue;

    if (session.roomId === newSession.roomId) {
      conflicts.push({
        type: 'room',
        message: `房间在该时间段已有场次安排`,
        conflictingSession: session
      });
    }

    if (session.hostId === newSession.hostId) {
      conflicts.push({
        type: 'host',
        message: `主持人在该时间段已有场次安排`,
        conflictingSession: session
      });
    }

    if (session.scriptId === newSession.scriptId) {
      conflicts.push({
        type: 'script',
        message: `该剧本在该时间段已有场次安排`,
        conflictingSession: session
      });
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}
