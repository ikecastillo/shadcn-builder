"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/#current-forms");
  }, [router]);

  return null;
}
