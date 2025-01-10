"use client"

import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export async function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      redirect("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }


export default function LogoutButton() {
    return (
        <form onSubmit={handleLogout} method="POST">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors w-full">
                <LogOut size={20} />
                Logout
            </button>
        </form>
    )
}