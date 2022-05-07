import * as React from "react";
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Button, Snackbar, TextInput, HelperText } from "react-native-paper";
import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import { getGlobalState, setGlobalState } from "../GlobalState";

var EMAIL_VERIFICATION_RE = /\S+@\S+\.\S+/;

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      response: [],
      ScreenHeight: Dimensions.get("window").height,
      email: "",
      password: "",
      snackbarMessage: "",
      emailInputError: false,
      showPassword: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: (props) => (
        <Text style={{ fontSize: 16 }}>
          <Feather name="user" size={24} color="black" />
          User: {getGlobalState("username")}
        </Text>
      ),
    });
  }

  check_user() {
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
    let error = EMAIL_VERIFICATION_RE.test(email) || email === "";
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

        <View style={{ height: this.state.ScreenHeight - 100 }}>
          <View style={[styles.container]}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={140}
              style={{ width: "90%" }}
            >
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
                style={{ marginTop: 1, marginBottom: 10 }}
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
                        <Feather name="eye" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  />
                }
                activeOutlineColor="#2196f3"
                activeUnderlineColor="#2196f3"
                selectionColor="#2196f3"
                secureTextEntry={!this.state.showPassword}
              />

              <View style={{ marginTop: 1 }}>
                <Button
                  mode="contained"
                  color="#2196f3"
                  onPress={this.check_user}
                >
                  Submit
                </Button>
              </View>
            </KeyboardAvoidingView>
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
