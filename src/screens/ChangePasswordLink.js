import * as React from "react";
import { View, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Snackbar, TextInput, Button } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import { setGlobalState } from "../GlobalState";


class ChangePasswordLink extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      snackbarMessage: "",
    };

    this.verifyUser = this.verifyUser.bind(this);
  }

  async verifyUser() {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ snackbarMessage: "Confirm Password Does Not Match Password", });
    }
    var response = await fetch(`${CONSTANTS.SERVER_URL}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.props.route.params.token,
        new_password: this.state.password
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
        params: { message: "Your Password Has Been Changed!" },
      });
    } else {
      console.warn(responseJson);
    }
  }

  render() {
    let snackbar = null;
    if (this.state.snackbarMessage !== "") {
      snackbar = (
        <Snackbar
          visible={true}
          onDismiss={() => this.setState({ snackbarMessage: "" })}
          style={{ marginBottom: 50, color: "black" }}
        >
          {this.state.snackbarMessage}
        </Snackbar>
      );
    }

    return (
      <View>
        {snackbar}
        <View style={{ height: "100%" }}>
          <View style={[styles.container]}>
            <View style={{ width: "90%" }}>
              <TextInput
                style={{ marginBottom: 10 }}
                label="Password"
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
                left={
                  <TextInput.Icon
                    name={() => (
                      <Feather name="lock" size={24} color="black" />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    name={() => (
                      <TouchableOpacity
                        onPress={(event) => {
                          event.stopPropagation();
                          this.setState({
                            showPassword: !this.state.showPassword,
                          });
                        }}
                      >
                        <Feather
                          name={this.state.showPassword ? "eye-off" : "eye"}
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    )}
                  />
                }
                activeOutlineColor="#2196f3"
                activeUnderlineColor="#2196f3"
                selectionColor="#2196f3"
                secureTextEntry={!this.state.showPassword}
              />

              <TextInput
                style={{ marginBottom: 10 }}
                label="Confirm Password"
                value={this.state.confirmPassword}
                onChangeText={(text) =>
                  this.setState({ confirmPassword: text })
                }
                left={
                  <TextInput.Icon
                    name={() => (
                      <Feather name="lock" size={24} color="black" />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    name={() => (
                      <TouchableOpacity
                        onPress={(event) => {
                          event.stopPropagation();
                          this.setState({
                            showConfirmPassword:
                              !this.state.showConfirmPassword,
                          });
                        }}
                      >
                        <Feather
                          name={
                            this.state.showConfirmPassword ? "eye-off" : "eye"
                          }
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    )}
                  />
                }
                activeOutlineColor="#2196f3"
                activeUnderlineColor="#2196f3"
                selectionColor="#2196f3"
                secureTextEntry={!this.state.showConfirmPassword}
              />
              <Button
                mode="contained"
                color="#2196f3"
                onPress={this.verifyUser}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <ChangePasswordLink route={route} navigation={navigation} />;
}
