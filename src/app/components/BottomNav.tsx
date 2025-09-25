"use client";
import Link from "next/link";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { List, Plus, Camera } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200">
      <div className="max-w-md mx-auto flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center text-blue-500 hover:text-blue-600">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Home</span>
        </Link>
        <Link href="/add" className="flex flex-col items-center text-blue-500 hover:text-blue-600">
          <PlusIcon className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Add</span>
        </Link>
        <Link href="/scan" className="flex flex-col items-center text-gray-500">
          <Camera size={24} />
        </Link>
      </div>
    </div>
  );
}