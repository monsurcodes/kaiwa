import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export const useMediaId = (): number | null => {
   const { id } = useLocalSearchParams<{ id?: string | string[] }>();

   return useMemo(() => {
      const rawId = Array.isArray(id) ? id[0] : id;
      const parsedId = Number(rawId);
      return Number.isFinite(parsedId) ? parsedId : null;
   }, [id]);
};
