"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        setServerError("Email atau password tidak sesuai. Pastikan akun terdaftar.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error("Login exception:", err);
      setServerError("Terjadi kendala jaringan saat menghubungi server autentikasi.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email Akun"
        type="email"
        placeholder="email@perusahaan.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="relative">
        <Input
          label="Kata Sandi (Password)"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-[34px] text-neutral-400 hover:text-neutral-700 transition"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 flex items-start gap-2">
          <Shield className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        className="mt-2 text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-sm h-11 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
      >
        <Lock className="h-4 w-4" />
        <span>{isLoading ? "Memverifikasi..." : "Masuk ke Nyales24/7"}</span>
      </Button>

      <div className="pt-1 text-center">
        <p className="text-[11px] text-neutral-400 font-medium">
          Akses terlindungi enkripsi TLS &amp; Row-Level Security Supabase
        </p>
      </div>
    </form>
  );
}
