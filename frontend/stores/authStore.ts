import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;

    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            register: async (name, email, password, passwordConfirmation) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/auth/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            password_confirmation: passwordConfirmation,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        const msg =
                            data?.errors
                                ? Object.values(data.errors as Record<string, string[]>)
                                    .flat()
                                    .join(" ")
                                : data?.message ?? "Registrasi gagal.";
                        set({ error: msg, isLoading: false });
                        return;
                    }

                    set({ user: data.user, token: data.access_token, isLoading: false });
                } catch {
                    set({ error: "Tidak bisa terhubung ke server.", isLoading: false });
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        const msg =
                            data?.errors
                                ? Object.values(data.errors as Record<string, string[]>)
                                    .flat()
                                    .join(" ")
                                : data?.message ?? "Login gagal.";
                        set({ error: msg, isLoading: false });
                        return;
                    }

                    set({ user: data.user, token: data.access_token, isLoading: false });
                } catch {
                    set({ error: "Tidak bisa terhubung ke server.", isLoading: false });
                }
            },

            logout: async () => {
                const { token } = get();
                set({ isLoading: true });
                try {
                    if (token) {
                        await fetch(`${API_URL}/auth/logout`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json",
                            },
                        });
                    }
                } finally {
                    set({ user: null, token: null, isLoading: false, error: null });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);