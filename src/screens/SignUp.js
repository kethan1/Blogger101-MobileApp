import * as React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Snackbar, TextInput, HelperText } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";


class Sign_Up extends React.Component {
  constructor() {
    super();

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      snackbarMessage: "",
      emailInputError: false,
      showPassword: false,
      showConfirmPassword: false,
    };

    this.checkUser = this.checkUser.bind(this);
  }

  checkUser() {
    var initialLinkingUrl = Linking.createURL("/confirm/");
    if (this.state.password === this.state.confirmPassword) {
      fetch(`${CONSTANTS.SERVER_URL}/api/v2/auth/add-user`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          mobile_phone_uri: initialLinkingUrl,
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (data.success) {
          this.props.navigation.navigate("LoggedOut", {
            screen: "Email Verification",
            params: { email: this.state.email }
          })
        } else {
          this.setState({
            snackbarMessage:
              data.already === "both"
                ? "Username and Email Already Taken"
                : `${data.already.charAt(0).toUpperCase() + data.already.slice(1)} Already Taken`,
          });
        }
      });
    } else {
      this.setState({
        snackbarMessage: "Confirm Password Does Not Match Password",
      });
    }
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
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ width: "50%", paddingRight: 3 }}>
                      <TextInput
                        style={{ marginTop: 1, marginBottom: 10 }}
                        label="First Name"
                        value={this.state.firstName}
                        onChangeText={(text) =>
                          this.setState({ firstName: text })
                        }
                        left={
                          <TextInput.Icon
                            name={() => (
                              <MaterialCommunityIcons
                                name="badge-account-horizontal-outline"
                                size={24}
                                color="black"
                              />
                            )}
                          />
                        }
                        activeOutlineColor="#2196f3"
                        activeUnderlineColor="#2196f3"
                        selectionColor="#2196f3"
                      />
                    </View>
                    <View style={{ width: "50%", paddingLeft: 3 }}>
                      <TextInput
                        style={{ marginTop: 1, marginBottom: 10 }}
                        label="Last Name"
                        value={this.state.lastName}
                        onChangeText={(text) => this.setState({ lastName: text })}
                        left={
                          <TextInput.Icon
                            name={() => (
                              <MaterialCommunityIcons
                                name="badge-account-horizontal-outline"
                                size={24}
                                color="black"
                              />
                            )}
                          />
                        }
                        activeOutlineColor="#2196f3"
                        activeUnderlineColor="#2196f3"
                        selectionColor="#2196f3"
                      />
                    </View>
                  </View>

                  <TextInput
                    style={{ marginTop: 1, marginBottom: 10 }}
                    label="Username"
                    value={this.state.username}
                    onChangeText={(text) => this.setState({ username: text })}
                    left={
                      <TextInput.Icon
                        name={() => (
                          <Feather name="tag" size={24} color="black" />
                        )}
                      />
                    }
                    activeOutlineColor="#2196f3"
                    activeUnderlineColor="#2196f3"
                    selectionColor="#2196f3"
                  />

                  <TextInput
                    style={{ marginTop: 1 }}
                    label="Email"
                    value={this.state.email}
                    onChangeText={(text) => {
                      this.setState({ email: text });
                      this.validateEmail(text);
                    }}
                    left={
                      <TextInput.Icon
                        name={() => (
                          <Feather name="mail" size={24} color="black" />
                        )}
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
                    style={{ marginTop: 1, marginBottom: 10 }}
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

                  <View style={{ marginTop: 1 }}>
                    <Button
                      mode="contained"
                      color="#2196f3"
                      onPress={this.checkUser}
                      style={{ borderRadius: 10 }}
                    >
                      Sign Up
                    </Button>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
          <View>
            <Text style={{ textAlign: "center", fontSize: 12 }}>
              Already have an account? <Text style={{ color: "#009DDC" }} onPress={() => this.props.navigation.navigate("Login")}>Login</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Sign_Up navigation={navigation} />;
}
