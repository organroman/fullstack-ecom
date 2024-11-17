"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { LoginFormData } from "@/types/types";
import { loginSchema } from "@/lib/schema";
import { login } from "@/api/auth";
import { useAuth } from "@/store/authStore";

const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const isLoggedIn = useAuth((s) => !!s.token);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      const data = await login(email, password);
      return data;
    },

    onSuccess: (data) => {
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: () => console.log("Error"),
  });

  const onSubmit = (formData: LoginFormData) => {
    loginMutation.mutate(formData);
  };

  if (isLoggedIn) {
    router.push("/dashboard");
  }
  return (
    <Card className="w-full h-full md:w-[487px] border-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>Welcome back!</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      name="password"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                className="w-full mt-6"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex flex-row">
                    <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              {loginMutation.isError && (
                <span className="text-sm text-red-500">
                  {loginMutation.error.message}
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardContent className="flex items-center justify-center">
        <p>
          Don&apos;t have an account?
          <Link href="/sign-up">
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
