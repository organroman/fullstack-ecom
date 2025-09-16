import { Text } from "react-native";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

import { VStack } from "./ui/vstack";
import { Input, InputField, InputIcon, InputSlot } from "./ui/input";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
}

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <VStack className="gap-1">
      <Text className="text-zinc-700 dark:text-zinc-300 text-sm">{label}</Text>
      <Input>
        <InputField
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
        />
        <InputSlot className="pr-3" onPress={toggleShowPassword}>
          <InputIcon
            as={showPassword ? EyeIcon : EyeOffIcon}
            className="text-blue-500"
          />
        </InputSlot>
      </Input>
      {error && <Text className="text-red-600 text-xs">{error}</Text>}
    </VStack>
  );
};

export default PasswordInput;
