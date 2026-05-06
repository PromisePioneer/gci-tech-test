"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Eye, EyeOff, AlertCircle, Activity} from "lucide-react";
import {useAuthStore} from "@/stores/authStore";

type LoginForm = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export default function LoginPage() {
    const router = useRouter();
    const {login, isLoading, error, clearError, user} = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginForm>({
        defaultValues: {email: "", password: "", rememberMe: false},
    });

    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [user, router]);

    const onSubmit = async (data: LoginForm) => {
        clearError();
        await login(data.email, data.password);
    };

    return (
        <div className="min-h-screen flex">
            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
                <div className="lg:hidden flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white"/>
                    </div>
                    <span className="font-semibold text-lg text-slate-900 dark:text-white">Zyntera</span>
                </div>

                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
                            Selamat datang kembali
                        </h1>
                    </div>

                    {error && (
                        <div
                            className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="nama@gmail.com"
                                className={`input input-bordered w-full h-10 bg-white dark:bg-slate-900 ${errors.email ? "input-error" : ""}`}
                                {...register("email", {
                                    required: "Email wajib diisi",
                                    pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid"},
                                })}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kata Sandi
                                </label>
                                <button type="button"
                                        className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
                                    Lupa kata sandi?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan kata sandi"
                                    className={`input input-bordered w-full h-10 pr-10 bg-white dark:bg-slate-900 ${errors.password ? "input-error" : ""}`}
                                    {...register("password", {required: "Kata sandi wajib diisi"})}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                className="checkbox checkbox-sm border-slate-300 dark:border-slate-600 checked:bg-teal-600 checked:border-teal-600"
                                {...register("rememberMe")}
                            />
                            <label htmlFor="rememberMe"
                                   className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer font-normal select-none">
                                Ingat saya selama 30 hari
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm border-0 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"/>
                                    Memuat...
                                </>
                            ) : "Masuk"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum punya akun?{" "}
                        <Link href="/register"
                              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}