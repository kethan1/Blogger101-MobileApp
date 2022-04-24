import * as React from "react";
import { View, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Header, Input } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import styles from "../styles/stylesheet_main.js";

class Sign_Up extends React.Component {
  constructor() {
    super();

    this.state = {
      entries: [],
      ScreenHeight: Dimensions.get("window").height,
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      snackbar_message: "",
    };
    this.check_user = this.check_user.bind(this);
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

  check_user() {
    if (this.state.password === this.state.confirm_password) {
      fetch("https://blogger-101.herokuapp.com/api/v1/auth/add-user", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
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
          this.props.navigation.navigate("Blogs", {
            message: "Successfully Signed Up",
            type: "success",
          });
        } else {
          this.setState({
            snackbar_message:
              data.already === "both"
                ? "Username and email taken"
                : `${data.already} taken`,
          });
        }
      });
    } else {
      this.setState({
        snackbar_message: "Confirm Password Does Not Match Password",
      });
    }
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
          style={{
            marginTop: 0,
            shadowOffset: { width: 100, height: 100 },
            shadowColor: "black",
            shadowOpacity: 1.0,
          }}
          backgroundColor="white"
          placement="left"
          centerComponent={{ text: "Sign Up" }}
          leftComponent={<Feather name="user-plus" size={20} color="black" />}
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
            <View style={{ width: "90%" }}>
              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={this.state.ScreenHeight / 2 - 150}
              >
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View style={{ width: "50%" }}>
                    <Input
                      placeholder="First Name"
                      leftIcon={<Feather name="user" size={24} color="black" />}
                      onChangeText={(c) => {
                        this.first_name = c;
                      }}
                    />
                  </View>
                  <View style={{ width: "50%" }}>
                    <Input
                      placeholder="Last Name"
                      leftIcon={<Feather name="user" size={24} color="black" />}
                      onChangeText={(c) => {
                        this.last_name = c;
                      }}
                    />
                  </View>
                </View>

                <Input
                  placeholder="Username"
                  leftIcon={<Feather name="user" size={24} color="black" />}
                  onChangeText={(c) => {
                    this.username = c;
                  }}
                />

                <Input
                  placeholder="Email"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={24}
                      color="black"
                    />
                  }
                  onChangeText={(c) => {
                    this.email = c;
                  }}
                />

                <Input
                  placeholder="Password"
                  leftIcon={<Feather name="lock" size={24} color="black" />}
                  onChangeText={(c) => {
                    this.password = c;
                  }}
                  secureTextEntry={true}
                />

                <Input
                  placeholder="Confirm Password"
                  leftIcon={<Feather name="lock" size={24} color="black" />}
                  onChangeText={(c) => {
                    this.confirm_password = c;
                  }}
                  secureTextEntry={true}
                />

                <View style={{ marginTop: 1 }}>
                  <Button
                    color="#2196f3"
                    tintColor="white"
                    onPress={() => this.check_user()}
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
