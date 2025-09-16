import { Link } from "expo-router";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Button, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";

interface EmptyProps {
  title: string;
  desc: string;
  href?: string;
  linkText?: string;
}

const Empty = ({ title, desc, href, linkText }: EmptyProps) => {
  return (
    <VStack className="p-4 items-center justify-center h-full gap-4">
      <Heading className="font-bold">{title}</Heading>
      <Text className="text-zinc-700 dark:text-zinc-300">{desc}</Text>
      {href && (
        <Link href={href} asChild>
          <Button size="lg" className="border">
            <ButtonText className="text-zinc-700 dark:text-zinc-300">
              {linkText}
            </ButtonText>
          </Button>
        </Link>
      )}
    </VStack>
  );
};

export default Empty;
