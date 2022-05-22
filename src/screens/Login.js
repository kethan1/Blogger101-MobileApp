import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Button, Snackbar, TextInput, HelperText } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import { setGlobalState } from "../GlobalState";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      response: [],
      email: "",
      password: "",
      snackbarMessage: "",
      emailInputError: false,
      showPassword: false,
    };

    this.checkUser = this.checkUser.bind(this);
  }

  checkUser() {
    if (this.state.emailInputError) {
      return;
    }
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/auth/check-user`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email.trim().toLowerCase(),
        password: this.state.password,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (data.found) {
        setGlobalState("email", this.state.email);
        setGlobalState("username", data.user.username);
        setGlobalState("password", this.state.password);
        await SecureStore.setItemAsync("blogger101_Email", this.state.email);
        await SecureStore.setItemAsync(
          "blogger101_Username",
          data.user.username
        );
        await SecureStore.setItemAsync(
          "blogger101_Password",
          this.state.password
        );
        this.props.navigation.navigate("LoggedIn", {
          screen: "Blogs",
          params: { message: "Successfully Logged In" },
        });
      } else {
        this.setState({
          snackbarMessage: "The Entered Email or Password Is Wrong",
        });
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
              <KeyboardAwareScrollView>
                <View>
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

                  <TextInput
                    style={{ marginBottom: 20 }}
                    label="Password"
                    value={this.state.password}
                    onChangeText={(text) => this.setState({ password: text })}
                    left={
                      <TextInput.Icon
                        name={() => <Feather name="lock" size={24} color="black" />}
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

                  <View style={{ marginHorizontal: 5 }}>
                    <Button
                      mode="contained"
                      color="#2196f3"
                      onPress={this.checkUser}
                      style={{ borderRadius: 10}}
                    >
                      Submit
                    </Button>
                  </View>

                  <Text style={{ textAlign: "center", color: "#009DDC", marginTop: 20, fontSize: 14 }} onPress={() => this.props.navigation.navigate("Change Password")}>
                    Forgot Your Password?
                  </Text>
                  
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
          
          <View>
            <Text style={{ textAlign: "center", fontSize: 12 }}>
              Don't have an account? <Text style={{ color: "#009DDC" }} onPress={() => this.props.navigation.navigate("Sign Up")}>Sign Up</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Login navigation={navigation} />;
}
