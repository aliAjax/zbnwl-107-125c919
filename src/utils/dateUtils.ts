import { format, differenceInSeconds, differenceInHours, isSameDay, isToday, addMinutes, intervalToDuration } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: zhCN });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm', { locale: zhCN });
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd', { locale: zhCN });
}

export function formatMonthDay(date: string | Date): string {
  return format(new Date(date), 'MM月dd日', { locale: zhCN });
}

export function formatWeekDay(date: string | Date): string {
  return format(new Date(date), 'EEEE', { locale: zhCN });
}

export function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}小时${mins}分钟`;
  } else if (hours > 0) {
    return `${hours}小时`;
  }
  return `${mins}分钟`;
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isUrgent: boolean;
  isWarning: boolean;
}

export function getCountdown(targetDate: string | Date): CountdownResult {
  const now = new Date();
  const target = new Date(targetDate);
  const diffInSeconds = differenceInSeconds(target, now);
  const isPast = diffInSeconds <= 0;

  if (isPast) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isUrgent: false,
      isWarning: false
    };
  }

  const duration = intervalToDuration({ start: now, end: target });
  const totalHours = differenceInHours(target, now);

  return {
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    isPast: false,
    isUrgent: totalHours < 1,
    isWarning: totalHours >= 1 && totalHours < 24
  };
}

export function isTimeOverlapping(
  start1: string | Date,
  end1: string | Date,
  start2: string | Date,
  end2: string | Date
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return s1 < e2 && e1 > s2;
}

export function getTimeSlots(startHour = 9, endHour = 24): number[] {
  const slots: number[] = [];
  for (let i = startHour; i <= endHour; i++) {
    slots.push(i);
  }
  return slots;
}

export function getWeekDates(baseDate: Date): Date[] {
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addMinutes(startOfWeek, i * 24 * 60));
  }
  return dates;
}

export { isSameDay, isToday };
