import { StatusBar } from "react-native";
import Home from "@/src/screens/Home";

export default function Index() {
  return (
    <>
        <StatusBar 
            backgroundColor="#0D0D0D"
            barStyle="light-content"
            translucent
        />
        <Home />
    </>
  );
}