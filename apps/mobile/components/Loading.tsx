import { ActivityIndicator, SafeAreaView } from "react-native";

const Loading = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ActivityIndicator className="size-6" />
    </SafeAreaView>
  );
};

export default Loading;
