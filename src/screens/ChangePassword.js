import * as React from "react";
import { View } from "react-native";

import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput, HelperText } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";


class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      response: [],
      email: "",
      emailInputError: false,
    };

    this.checkUser = this.checkUser.bind(this);
  }

  checkUser() {
    if (this.state.emailInputError) {
      return;
    }
    var initialLinkingUrl = Linking.createURL("/change_password/");
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/auth/change-password-email`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email.trim().toLowerCase(),
        mobile_phone_uri: initialLinkingUrl,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (data["success"]) {
        this.props.navigation.navigate("LoggedOut", {
          screen: "Change Password Email",
          params: { email: this.state.email }
        })
      } else {
        console.error(data);
      }
    });
  }

  validateEmail(email) {
    let error = CONSTANTS.EMAIL_VERIFICATION_RE.test(email) || email === "";
    if (this.state.emailInputError !== !error) {
      this.setState({ emailInputError: !error });
    }
  }

  render() {
    return (
      <View>
        <View style={{ height: "100%" }}>
          <View style={[styles.container]}>
            <View style={{ width: "90%" }}>
              <TextInput
                label="Email"
                value={this.state.email}
                onChangeText={(text) => {
                    this.setState({ email: text });
                    this.validateEmail(text);
                }}
                left={
                    <TextInput.Icon
                    name={() => <Feather name="mail" size={24} color="black" />}
                    />
                }
                activeOutlineColor={
                    this.state.emailInputError ? "#ff1f1f" : "#2196f3"
                }
                activeUnderlineColor={
                    this.state.emailInputError ? "#ff1f1f" : "#2196f3"
                }
              />
              <HelperText type="error" visible={this.state.emailInputError}>
                Email address is invalid!
              </HelperText>

              <View style={{ marginTop: 1 }}>
                <Button
                    mode="contained"
                    color="#2196f3"
                    onPress={this.checkUser}
                >
                    Submit
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <ChangePassword navigation={navigation} />;
}
