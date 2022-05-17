import * as React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import CONSTANTS from "../Constants";
import { setGlobalState } from "../GlobalState";
import AppLoading from "expo-app-loading";
import * as SecureStore from "expo-secure-store";

class EmailVerification extends React.Component {
  constructor() {
    super();
    this.state = {};

    this.verifyUser = this.verifyUser.bind(this);
  }

  async verifyUser() {
    var response = await fetch(`${CONSTANTS.SERVER_URL}/api/v1/auth/confirm-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.props.route.params.token,
      }),
    });
    var responseJson = await response.json();
    if (response.status == 200) {
      setGlobalState("email", responseJson.user.email);
      setGlobalState("username", responseJson.user.username);
      setGlobalState("password", responseJson.user.password);
      SecureStore.setItemAsync("blogger101_Email", responseJson.user.email);
      SecureStore.setItemAsync("blogger101_Username", responseJson.user.username);
      SecureStore.setItemAsync("blogger101_Password", responseJson.user.password);
      this.props.navigation.navigate("LoggedIn", {
        screen: "Blogs",
        params: { message: "Your Email Has Been Verified!" },
      });
    } else {
      console.log(responseJson)
    }
  }

  render() {
    return <AppLoading
      startAsync={this.verifyUser}
      onFinish={() => null}
      onError={console.warn}
    />;
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <EmailVerification route={route} navigation={navigation} />;
}
