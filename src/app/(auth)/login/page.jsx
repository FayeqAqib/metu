"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

// تعریف schema اعتبارسنجی با Zod
const loginSchema = z.object({
  username: z.string().min(3, "حداقل 3 حرف وارد کنید"),
  password: z
    .string()
    .min(6, "حداقل 6 حرف وارد کنید")
    .max(36, "حد اگثر 36 حرف مجاز است "),
});

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    startTransition(async () => {
      setLoginError(null);
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });
      console.log(result);
      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.error) {
        toast.success("به حساب کاربری تان خوش آمدید");
        form.reset();
        router.push("/customer/home");
      } else {
        toast.error("رمز یا نام کاربری شما تا معتبر است");
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        animation: "gradientBG 5s ease-in-out infinite",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white rounded-lg shadow-xl shadow-[#00000079] p-8 space-y-6"
        >
          <div className="">
            <img src="/man.png" className="size-24 mx-auto" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            ورود به حساب
          </h2>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label>نام کاربری</Label>
                <FormControl>
                  <Input placeholder="نام کاربری خود را وارد کنید" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>رمز عبور</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && (
            <p className="text-red-600 text-center text-sm">{loginError}</p>
          )}

          <Button type="submit" className="w-full">
            {isPending ? <Loader2Icon className="animate-spin mr-2" /> : "ورود"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
