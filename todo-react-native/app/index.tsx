import { StatusBar } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from "@/src/screens/Home";

export default function Index() {
  return (
    <>
      <StatusBar
        backgroundColor="#0D0D0D"
        barStyle="light-content"
        translucent
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Home />
      </GestureHandlerRootView>
    </>
  );
}
