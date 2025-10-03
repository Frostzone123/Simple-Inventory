"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Camera, UserPlus } from "lucide-react"; // UserPlus for register icon
import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

export function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const linkClasses = (path: string) =>
    `flex flex-col items-center ${
      pathname === path ? "text-blue-500" : "text-gray-500"
    } hover:text-blue-600`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200">
      <div className="max-w-md mx-auto flex justify-around py-2">
        <Link href="/" className={linkClasses("/")}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Home</span>
        </Link>
        <Link href="/add" className={linkClasses("/add")}>
          <PlusIcon className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Add</span>
        </Link>
        <Link href="/scan" className={linkClasses("/scan")}>
          <Camera size={24} />
          <span className="text-xs font-medium mt-1">Scan</span>
        </Link>
        {/* Show Register only if user is admin */}
        {user?.isAdmin && (
          <Link href="/register" className={linkClasses("/register")}>
            <UserPlus size={24} />
            <span className="text-xs font-medium mt-1">Register</span>
          </Link>
        )}
      </div>
    </div>
  );
}