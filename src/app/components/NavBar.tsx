"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export function NavBar({ title = "Simple Inven" }: { title?: string }) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-white py-4 shadow-sm sticky top-0 z-10">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        <div className="flex items-center space-x-2">
          {/* Add Button */}
          <Link href="/add">
            <div className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition">
              <PlusIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}