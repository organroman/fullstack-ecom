import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Redirect } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { login } from "@/api/auth";
import { useAuth } from "@/store/authStore";
import { LoginFormData } from "@/types/types";
import { loginSchema } from "@/utils/schema";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
    onError: (error) => console.log(error.message),
  });

  const onSubmit = (formData: LoginFormData) => {
    loginMutation.mutate(formData);
  };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => {
      return !showPassword;
    });
  };

  if (isLoggedIn) {
    return <Redirect href="home" />;
  }

  return (
    <FormControl className="p-4 border rounded-lg border-outline-300 bg-white m-2 max-w-[400px] w-full mx-auto">
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">Login</Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Email</Text>
          <Input>
            <InputField
              value={watch("email")}
              onChangeText={(text) => setValue("email", text)}
              type="text"
            />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Password</Text>
          <Input className="text-center">
            <InputField
              value={watch("password")}
              onChangeText={(text) => setValue("password", text)}
              type={showPassword ? "text" : "password"}
            />
            <InputSlot className="pr-3" onPress={handleShowPassword}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                className="text-darkBlue-500"
              />
            </InputSlot>
          </Input>
        </VStack>
        <VStack space="md">
          <Button
            isDisabled={loginMutation.isPending}
            size="md"
            onPress={handleSubmit(onSubmit)}
          >
            {loginMutation.isPending && <ButtonSpinner />}
            <ButtonText>
              {loginMutation.isPending ? "Please wait..." : "Login"}
            </ButtonText>
          </Button>
          <Text className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold">
              Create a new one
            </Link>
          </Text>
        </VStack>
      </VStack>
    </FormControl>
  );
}
