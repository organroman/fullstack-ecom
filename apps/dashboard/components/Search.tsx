import { Dispatch, SetStateAction } from "react";
import { DeleteIcon, SearchIcon } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchProps {
  searchPhrase: string;
  handleSearch: (searchPhrase: string) => void;
  onChange: Dispatch<SetStateAction<string>>;
}

const Search = ({ searchPhrase, handleSearch, onChange }: SearchProps) => {
  return (
    <div className="relative h-10">
      <Input
        type="text"
        value={searchPhrase}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type for search"
        className="w-[320px] border border-input rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-600"
      />
      {searchPhrase && (
        <Button
          variant="link"
          onClick={() => onChange("")}
          className="absolute right-10 top-1/2 -translate-y-1/2 z-10 text-muted-foreground px-2 py-0 hover:text-muted-foreground/80"
        >
          <DeleteIcon />
        </Button>
      )}
      <Button
        variant="link"
        onClick={() => handleSearch(searchPhrase)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-2 text-blue-500 hover:text-blue-700"
      >
        <SearchIcon />
      </Button>
    </div>
  );
};

export default Search;
