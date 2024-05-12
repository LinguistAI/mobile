type Day = {
  id: number;
  name: string;
  short: string;
  letter: string;
};

export const DaysOfWeek: Day[] = [
  { id: 0, name: 'Sunday', short: 'Sun', letter: 'S' },
  { id: 1, name: 'Monday', short: 'Mon', letter: 'M' },
  { id: 2, name: 'Tuesday', short: 'Tue', letter: 'T' },
  { id: 3, name: 'Wednesday', short: 'Wed', letter: 'W' },
  { id: 4, name: 'Thursday', short: 'Thu', letter: 'T' },
  { id: 5, name: 'Friday', short: 'Fri', letter: 'F' },
  { id: 6, name: 'Saturday', short: 'Sat', letter: 'S' },
];

export function getCurrentDayOfWeek(): Day {
  const today = new Date();
  return DaysOfWeek[today.getDay()];
}

export function getLastOneWeek(): Day[] {
  const days = DaysOfWeek;
  const today = getCurrentDayOfWeek();

  const daysWithoutToday = [...days.slice(today.id + 1), ...days.slice(0, today.id)];
  const reorderedDays = [...daysWithoutToday, today];
  return reorderedDays;
}

export function getDistanceBetweenTodayAndDay(day: Day): number {
  const today = getCurrentDayOfWeek();
  const todayIndex = DaysOfWeek.findIndex((d) => d.id === today.id);
  const dayIndex = DaysOfWeek.findIndex((d) => d.id === day.id);
  return (todayIndex - dayIndex + 7) % 7;
}

export function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
