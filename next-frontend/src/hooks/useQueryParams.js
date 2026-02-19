"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const getParam = (key, defaultValue) => {
    return searchParams.get(key) ?? defaultValue;
  };

  return { getParam, setParams };
};

export default useQueryParams;
