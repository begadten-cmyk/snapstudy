"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboarded } from "@/lib/storage";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isOnboarded()) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
