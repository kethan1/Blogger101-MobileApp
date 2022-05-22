import * as React from "react";

import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";

import { setGlobalState } from "../GlobalState";

class Logout extends React.Component {
  async logout() {
    await SplashScreen.preventAutoHideAsync();
    await SecureStore.deleteItemAsync("blogger101_Email");
    await SecureStore.deleteItemAsync("blogger101_Username");
    await SecureStore.deleteItemAsync("blogger101_Password");
    setGlobalState("email", null);
    setGlobalState("username", null);
    setGlobalState("password", null);
    this.props.navigation.navigate("LoggedOut", {
      screen: "Blogs",
      params: { message: "Successfully Logged Out" },
    });
    await SplashScreen.hideAsync();
  }

  render() {
    this.logout();
    return null;
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Logout navigation={navigation} />;
}
