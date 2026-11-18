"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default function OrganizerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const session = getAuthSession();

      if (!session) {
        setAuthorized(false);
        setChecking(false);
        router.replace("/login");
        return;
      }

      if (session.role !== "ORGANIZER") {
        setAuthorized(false);
        setChecking(false);
        router.replace(
          session.role === "TEAM_MANAGER"
            ? "/manager/dashboard"
            : "/"
        );
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    checkAuth();

    window.addEventListener("dropzone-auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("dropzone-auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [router]);

  if (checking || !authorized) {
    return (
      <div className="min-h-screen bg-[#090b0e] flex items-center justify-center text-[#d6ff3f]">
        Verifying access...
      </div>
    );
  }

  return <>{children}</>;
}