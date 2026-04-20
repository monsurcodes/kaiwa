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
   switch (month) {
      case 1:
         return "Jan";
      case 2:
         return "Feb";
      case 3:
         return "Mar";
      case 4:
         return "Apr";
      case 5:
         return "May";
      case 6:
         return "Jun";
      case 7:
         return "Jul";
      case 8:
         return "Aug";
      case 9:
         return "Sep";
      case 10:
         return "Oct";
      case 11:
         return "Nov";
      case 12:
         return "Dec";
      default:
         return "";
   }
};
