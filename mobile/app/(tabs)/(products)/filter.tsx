import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import {
  CheckCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Square,
} from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/components/ui/ThemeProvider";

import Loading from "@/components/Loading";

import { useGetCategories } from "@/api/categories/useGetCategories";

import { cn } from "@/utils/utils";
import { TEXT_COLOR } from "@/utils/constants";

export type Category = {
  id: string | number;
  name: string;
};

const FilterScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { categoryId } = useGlobalSearchParams();

  const { data, isLoading } = useGetCategories("");

  const [selectedItem, setSelectedItem] = useState<Category | null>(null);

  useEffect(() => {
    if (data?.categories) {
      const selectedCategory =
        data.categories.find(
          (category: Category) => category.id.toString() === categoryId
        ) || null;
      setSelectedItem(selectedCategory);
    }
  }, [data, categoryId]);

  const handleCategorySelect = (category: Category) => {
    if (selectedItem?.id === category.id) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(category);
  };

  const handleApplyFilter = () => {
    router.replace({
      pathname: `(tabs)/(products)?`,
      params: { categoryId: selectedItem?.id.toString() || undefined },
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button variant="link" onPress={() => router.dismiss()}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          ),
          headerRight: () => (
            <Button variant="link" onPress={() => handleApplyFilter()}>
              <ButtonText>Apply</ButtonText>
            </Button>
          ),
          title: "Products filter",
          headerTitleStyle: {
            color: TEXT_COLOR(theme),
          },
        }}
      />
      <View>
        <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="shadow-none mt-2"
          defaultValue={["category"]}
        >
          <AccordionItem value="category">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <>
                      <AccordionTitleText size="lg" className="text-lg">
                        Category
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <ScrollView className="w-full flex flex-col gap-2">
                {data.categories.map((category: Category) => (
                  <Pressable
                    key={category.id}
                    className="flex flex-row items-center justify-between py-1"
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      className={cn(
                        "text-lg font-light text-zinc-700 dark:text-zinc-300",
                        selectedItem?.id === category.id &&
                          "text-blue-500 dark:text-blue-500 font-semibold"
                      )}
                    >
                      {category.name}
                    </Text>
                    <Icon
                      as={
                        selectedItem?.id === category.id
                          ? CheckCheckIcon
                          : Square
                      }
                      className={cn(
                        "stroke-[1px]",
                        selectedItem?.id === category.id &&
                          "text-blue-500 stroke-[2px]"
                      )}
                      size="xl"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </>
  );
};

export default FilterScreen;
