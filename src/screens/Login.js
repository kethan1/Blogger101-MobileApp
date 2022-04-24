import * as React from "react";
import { View, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Input, Header } from "react-native-elements";
import { Button, Snackbar } from "react-native-paper";
import styles from "../styles/stylesheet_main.js";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      response: [],
      ScreenHeight: Dimensions.get("window").height,
      email: "",
      password: "",
      snackbar_message: "",
    };
  }

  check_user() {
    fetch("https://blogger-101.herokuapp.com/api/v1/auth/check-user", {
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
        await SecureStore.setItemAsync("blogger101_Email", this.state.email);
        await SecureStore.setItemAsync("blogger101_Username", data.user_found);
        await SecureStore.setItemAsync(
          "blogger101_Password",
          this.state.password
        );
        this.props.navigation.navigate("Blogs", {
          message: "Logged In Successfully",
        });
      } else {
        this.setState({
          snackbar_message: "The Entered Email or Password Is Wrong",
        });
      }
    });
  }

  componentDidMount() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        this.setState({ toDisplayUserLoggedIn: "User Not Logged In" });
      } else {
        this.setState({ toDisplayUserLoggedIn: username });
      }
    });
  }

  render() {
    let snackbar = null;
    if (this.state.snackbar_message !== "") {
      snackbar = (
        <Snackbar visible={true}>{this.state.snackbar_message}</Snackbar>
      );
    }

    return (
      <View>
        {snackbar}
        <Header
          style={[styles.header]}
          backgroundColor="white"
          placement="left"
          centerComponent={{ text: "Login" }}
          leftComponent={
            <SimpleLineIcons name="login" size={20} color="black" />
          }
          rightComponent={
            <View style={[styles.oneLineView]}>
              <Text>
                <Feather name="user" size={18} color="black" />
                User Logged In: {this.state.toDisplayUserLoggedIn}
              </Text>
            </View>
          }
        />

        <View style={{ height: this.state.ScreenHeight - 100 }}>
          <View style={[styles.container]}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={140}
              style={{ width: "90%" }}
            >
              <Input
                placeholder="Email"
                leftIcon={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={24}
                    color="black"
                  />
                }
                onChangeText={(c) => this.setState({ email: c })}
              />

              <Input
                placeholder="Password"
                leftIcon={<Feather name="lock" size={24} color="black" />}
                onChangeText={(c) => this.setState({ password: c })}
                secureTextEntry={true}
              />

              <View style={{ marginTop: 1 }}>
                <Button
                  mode="contained"
                  color="#2196f3"
                  onPress={() => this.check_user()}
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
