export const formatAiringDate = (timestamp: number | null) => {
   if (!timestamp) return;

   return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
   }).format(new Date(timestamp * 1000));
};

export const minutesToDays = (minutes: number) => {
   const days = minutes / 1440;
   return days.toFixed(2);
};

export const getMonth = (month: number): string => {
   if (month < 1 || month > 12) return "";

   return new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(new Date(Date.UTC(2026, month - 1, 1)))
      .toUpperCase();
};

const getReferenceDate = (): Date => {
   return new Date();
};

const isSameDate = (first: Date, second: Date): boolean =>
   first.getFullYear() === second.getFullYear() &&
   first.getMonth() === second.getMonth() &&
   first.getDate() === second.getDate();

export const isTimestampToday = (timestamp: number | null | undefined): boolean => {
   if (!timestamp) return false;

   const targetDate = new Date(timestamp * 1000);
   const referenceDate = getReferenceDate();

   const tomorrow = new Date(referenceDate);
   tomorrow.setDate(referenceDate.getDate() + 1);

   return isSameDate(targetDate, referenceDate) || isSameDate(targetDate, tomorrow);
};

export const compareTimestampTodayFirstTomorrowLast = (
   firstTimestamp: number | null | undefined,
   secondTimestamp: number | null | undefined,
): number => {
   const referenceDate = getReferenceDate();
   const tomorrow = new Date(referenceDate);
   tomorrow.setDate(referenceDate.getDate() + 1);

   const getPriority = (timestamp: number | null | undefined): number => {
      if (!timestamp) return 1;

      const date = new Date(timestamp * 1000);

      if (isSameDate(date, referenceDate)) return 0;
      if (isSameDate(date, tomorrow)) return 2;
      return 1;
   };

   const priorityDiff = getPriority(firstTimestamp) - getPriority(secondTimestamp);
   if (priorityDiff !== 0) return priorityDiff;

   const first = firstTimestamp ?? 0;
   const second = secondTimestamp ?? 0;
   return first - second;
};

export const getTimestampDayLabel = (
   timestamp: number | null | undefined,
): "today" | "tomorrow" | null => {
   if (!timestamp) return null;

   const targetDate = new Date(timestamp * 1000);
   const referenceDate = getReferenceDate();
   const tomorrow = new Date(referenceDate);
   tomorrow.setDate(referenceDate.getDate() + 1);

   if (isSameDate(targetDate, referenceDate)) return "today";
   if (isSameDate(targetDate, tomorrow)) return "tomorrow";

   return null;
};
