import { Link } from "expo-router";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Button, ButtonText } from "./ui/button";

interface EmptyProps {
  title: string;
  desc: string;
  href: string;
  linkText: string;
}

const Empty = ({ title, desc, href, linkText }: EmptyProps) => {
  return (
    <VStack className="p-4 items-center justify-center h-full gap-4">
      <Text className="font-bold">{title}</Text>
      <Text>{desc}</Text>
      <Link href={href} asChild>
        <Button>
          <ButtonText>{linkText}</ButtonText>
        </Button>
      </Link>
    </VStack>
  );
};

export default Empty;
