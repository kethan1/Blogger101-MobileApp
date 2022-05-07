import * as React from "react";
import { View, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import { Button, Snackbar, TextInput, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";

var EMAIL_VERIFICATION_RE = /\S+@\S+\.\S+/;

class Sign_Up extends React.Component {
  constructor() {
    super();

    this.state = {
      entries: [],
      screenHeight: Dimensions.get("window").height,
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      snackbarMessage: "",
      emailInputError: false,
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        this.setState({ toDisplayUserLoggedIn: "Not Logged In" });
      } else {
        this.setState({ toDisplayUserLoggedIn: username });
      }
    });
    this.props.navigation.setOptions({
      headerRight: (props) => (
        <Text style={{ fontSize: 16 }}>
          <Feather name="user" size={24} color="black" />
          User: {this.state.toDisplayUserLoggedIn}
        </Text>
      ),
    });
  }

  check_user() {
    if (this.state.password === this.state.confirmPassword) {
      fetch(`${CONSTANTS.SERVER_URL}/api/v1/auth/add-user`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (data.success) {
          SecureStore.setItemAsync("blogger101_Email", this.state.email);
          SecureStore.setItemAsync("blogger101_Username", this.state.username);
          SecureStore.setItemAsync("blogger101_Password", this.state.password);
          this.props.navigation.navigate("LoggedIn", {
            screen: "Blogs",
            params: { message: "Successfully Signed Up" },
          });
        } else {
          this.setState({
            snackbarMessage:
              data.already === "both"
                ? "Username and email taken"
                : `${data.already} taken`,
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

        <View style={{ height: this.state.screenHeight - 100 }}>
          <View style={[styles.container]}>
            <View style={{ width: "90%" }}>
              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={this.state.screenHeight / 2 - 150}
              >
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
                  activeOutlineColor="#2196f3"
                  activeUnderlineColor="#2196f3"
                  selectionColor="#2196f3"
                  secureTextEntry
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
                  activeOutlineColor="#2196f3"
                  activeUnderlineColor="#2196f3"
                  selectionColor="#2196f3"
                  secureTextEntry
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
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Sign_Up navigation={navigation} />;
}
