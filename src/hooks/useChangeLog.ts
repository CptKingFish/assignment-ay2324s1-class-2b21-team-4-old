import { useEffect, useRef } from "react";

function useLogger<T>(data: T, name: string) {
  const previousDataRef = useRef<T>(data);

  useEffect(() => {
    if (previousDataRef.current !== data) {
      console.log(`[${name}]`, data);
      previousDataRef.current = data;
    }
  }, [data, name]);

  return data;
}

export default useLogger;
