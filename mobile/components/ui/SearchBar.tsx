import { SearchIcon } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "./input";

export function SearchBar({ searchPhrase, setSearchPhrase }: any) {
  return (
    <Input className="bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-600 rounded-md">
      <InputSlot className="pl-3 text-gray-400 dark:text-gray-300">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        onChangeText={setSearchPhrase}
        placeholder="Search..."
        value={searchPhrase}
        className="text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      />
    </Input>
  );
}
