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
