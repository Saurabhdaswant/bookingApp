import { addDays, addMinutes, startOfDay, startOfWeek } from "date-fns";

// Generate slots for each day of the week
const generateSlotsForWeek = () => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days: Date[] = [];
  const slots: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    days.push(day);

    slots.push(...getSlots(day));
  }

  return { days, slots };
};

// Get slots for a given day
const getSlots = (day: Date) => {
  const slots: Date[] = [];
  let slot = startOfDay(day);

  for (let i = 0; i < 32; i++) {
    slots.push(slot);

    slot = addMinutes(slot, 45);
  }

  return slots;
};

export { getSlots, generateSlotsForWeek };
