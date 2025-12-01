"use client";

import { useEffect } from "react";
import { initRollbar } from "@/lib/rollbar-client";

export function ClientInit() {
  useEffect(() => {
    initRollbar();
  }, []);

  return null;
}
