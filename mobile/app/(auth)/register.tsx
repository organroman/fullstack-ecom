import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";

import { EyeIcon, EyeOffIcon } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { register } from "@/api/auth";
import { useAuth } from "@/store/authStore";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const loginMutation = useMutation({
    mutationFn: () => register(name, email, password),
    onSuccess: (data) => {
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: () => console.log("Error"),
  });

  const handleShowPassword = () => {
    setShowPassword((showPassword) => {
      return !showPassword;
    });
  };

  return (
    <FormControl className="p-4 border rounded-lg border-outline-300 bg-white m-2 max-w-[400px] w-full mx-auto">
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">
          Register
        </Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Name</Text>
          <Input>
            <InputField value={name} onChangeText={setName} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Email</Text>
          <Input>
            <InputField value={email} onChangeText={setEmail} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Password</Text>
          <Input className="text-center">
            <InputField
              value={password}
              onChangeText={setPassword}
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
            size="md"
            onPress={() => {
              // loginMutation.mutate();
            }}
          >
            <ButtonText>Login</ButtonText>
          </Button>
          <Text className="text-sm text-gray-600">
            Alredy have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </VStack>
    </FormControl>
  );
}
