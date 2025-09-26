"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Camera } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

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
      </div>
    </div>
  );
}