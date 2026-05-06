"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/stores/authStore";

export default function RegisterPage() {
    const router = useRouter();
    const {register, isLoading, error, clearError, user} = useAuthStore();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearError();
        setClientError(null);
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setClientError("Konfirmasi password tidak cocok.");
            return;
        }
        await register(form.name, form.email, form.password, form.password_confirmation);
    };

    const displayError = clientError ?? error;

    const passwordStrength = (() => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    })();

    const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat kuat"][passwordStrength];
    const strengthColor = ["", "progress-error", "progress-warning", "progress-success", "progress-success"][passwordStrength];

    return (
        <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body gap-5">
                    {/* Header */}
                    <div className="text-center">
                        <div
                            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-secondary" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold">Buat akun baru</h1>
                        <p className="text-base-content/60 text-sm mt-1">Daftar dan mulai sekarang</p>
                    </div>

                    {/* Error alert */}
                    {displayError && (
                        <div role="alert" className="alert alert-error py-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="text-sm">{displayError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Nama */}
                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text font-medium">Nama lengkap</span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama Anda"
                                className="input input-bordered w-full"
                                required
                                autoComplete="name"
                            />
                        </label>

                        {/* Email */}
                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text font-medium">Email</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="nama@email.com"
                                className="input input-bordered w-full"
                                required
                                autoComplete="email"
                            />
                        </label>

                        {/* Password */}
                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text font-medium">Password</span>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimal 8 karakter"
                                    className="input input-bordered w-full pr-12"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPass ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {/* Password strength */}
                            {form.password && (
                                <div className="mt-2 space-y-1">
                                    <progress
                                        className={`progress ${strengthColor} w-full h-1.5`}
                                        value={passwordStrength}
                                        max={4}
                                    />
                                    <p className="text-xs text-base-content/50">{strengthLabel}</p>
                                </div>
                            )}
                        </label>

                        {/* Konfirmasi Password */}
                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text font-medium">Konfirmasi password</span>
                            </div>
                            <input
                                type={showPass ? "text" : "password"}
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Ulangi password"
                                className={`input input-bordered w-full ${
                                    form.password_confirmation && form.password !== form.password_confirmation
                                        ? "input-error"
                                        : ""
                                }`}
                                required
                                autoComplete="new-password"
                            />
                            {form.password_confirmation && form.password !== form.password_confirmation && (
                                <div className="label pt-1">
                                    <span className="label-text-alt text-error">Password tidak cocok</span>
                                </div>
                            )}
                        </label>

                        <button
                            type="submit"
                            className="btn btn-secondary w-full mt-1"
                            disabled={isLoading}
                        >
                            {isLoading && <span className="loading loading-spinner loading-sm"/>}
                            {isLoading ? "Memproses..." : "Daftar"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/60">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="link link-secondary font-medium">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}