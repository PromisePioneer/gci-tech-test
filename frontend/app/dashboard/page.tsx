"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isLoading } = useAuthStore();

    useEffect(() => {
        if (!user) router.replace("/login");
    }, [user, router]);

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body gap-4 items-center text-center">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-16">
                            <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-base-content/60 text-sm">{user.email}</p>
                    </div>

                    <div className="badge badge-success badge-outline gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                        Sudah login
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn btn-error btn-outline btn-sm mt-2"
                        disabled={isLoading}
                    >
                        {isLoading && <span className="loading loading-spinner loading-xs" />}
                        Keluar
                    </button>
                </div>
            </div>
        </main>
    );
}