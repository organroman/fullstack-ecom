"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

import { SignUpFormData } from "@/types/types";
import { signUpSchema } from "@/lib/schema";
import { login, register as signUp } from "@/api/auth";
import { useAuth } from "@/store/authStore";

const RegisterForm = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      address: "",
    },
  });

  const router = useRouter();

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const isLoggedIn = useAuth((s) => !!s.token);

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, address }: SignUpFormData) => {
      const data = await signUp(name, email, password, address);
      return data;
    },

    onSuccess: async (data, variables) => {
      if (data) {
        const loginData = await login(variables.email, variables.password);
        if (loginData.user && loginData.token) {
          setUser(loginData.user);
          setToken(loginData.token);
        }
      }
    },
    onError: () => console.log("Error"),
  });

  const onSubmit = (formData: SignUpFormData) => {
    registerMutation.mutate(formData);
  };

  if (isLoggedIn) {
    router.push("/dashboard");
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree with our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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
                      name="password"
                      type="password"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="address"
                      placeholder="Enter your delivery address"
                      
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <div className="flex flex-row">
                    <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
              {registerMutation.isError && (
                <span className="text-sm text-red-500">
                  {registerMutation.error.message}
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardContent className="flex items-center justify-center">
        <p>
          Already have an account?
          <Link href="/login">
            <span className="text-blue-700">&nbsp;Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
