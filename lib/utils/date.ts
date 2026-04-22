export const formatAiringDate = (timestamp: number) => {
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
