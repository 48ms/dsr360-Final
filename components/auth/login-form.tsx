"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, Shield, Sparkles } from "lucide-react";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleQuickFill(email: string, pass: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
  }

  function onSubmit(data: LoginInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Quick Select Chips */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Akses Cepat Pengguna (1-Tap Fill):</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("bimasaputra.hum@gmail.com", "bima123456")}
            className="flex flex-col text-left px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-neutral-800 transition active:scale-95 shadow-2xs"
          >
            <span className="text-xs font-bold text-neutral-900 leading-tight">Bima Maulana</span>
            <span className="text-[10px] text-amber-800 font-medium">DSR Bandung</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill("fendi@gmail.com", "Subang")}
            className="flex flex-col text-left px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-neutral-800 transition active:scale-95 shadow-2xs"
          >
            <span className="text-xs font-bold text-neutral-900 leading-tight">Fendi</span>
            <span className="text-[10px] text-amber-800 font-medium">DSR Subang</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Akun Sales"
          type="email"
          placeholder="bimasaputra.hum@gmail.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 flex items-start gap-2">
            <Shield className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <Button
          type="submit"
          isLoading={isPending}
          className="mt-2 text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-sm h-11 rounded-2xl"
        >
          Masuk ke Nyales24/7
        </Button>
      </form>
    </div>
  );
}
