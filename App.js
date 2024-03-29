import "react-native-gesture-handler";

import React, { useState } from "react";
import { Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { SimpleLineIcons, Entypo, Feather } from "@expo/vector-icons";
import { useFonts, Recursive_300 } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";

import Blogs from "./src/screens/Blogs";
import BlogInfo from "./src/screens/BlogTemplate";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import Logout from "./src/screens/Logout";
import PostBlog from "./src/screens/PostBlog";
import EmailSent from "./src/screens/EmailSent";
import EmailVerification from "./src/screens/EmailVerification";
import ChangePasswordEmailSent from "./src/screens/ChangePasswordEmailSent";
import ChangePassword from "./src/screens/ChangePassword";
import ChangePasswordLink from "./src/screens/ChangePasswordLink";
import MyBlogs from "./src/screens/MyBlogs";
import EditBlog from "./src/screens/EditBlog";

import { getGlobalState, setGlobalState } from "./src/GlobalState";

const LoggedOutTab = createBottomTabNavigator();
const LoggedInTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const prefix = Linking.createURL("/");
const config = {
  screens: {
    LoggedOut: {
      screens: {
        "Email Verification Link": "confirm/:token",
        "Change Password Link": "change_password/:token",
      },
    },
  },
};

function getTabBarIcon(route) {
  return ({ focused, color, size }) => {
    if (route.name === "Blogs") {
      return <Entypo name="text-document" size={size} color={color} />;
    } else if (route.name === "Post Blog") {
      return <Entypo name="new-message" size={size} color={color} />;
    } else if (route.name === "Login") {
      return (
        <View>
          <Feather name="user" size={size} color={color} />
          <Feather
            name="arrow-right"
            size={(7 / 12) * size}
            color={color}
            style={{
              position: "absolute",
              marginLeft: 16,
              marginTop: 4,
              fontWeight: "bold",
            }}
          />
        </View>
      );
    } else if (route.name === "Sign Up") {
      return <Feather name="user-plus" size={size} color={color} />;
    } else if (route.name === "Logout") {
      return <SimpleLineIcons name="logout" size={size} color={color} />;
    } else if (route.name === "My Blogs") {
      return <Feather name="folder" size={size} color={color} />;
    }
  };
}

function LoggedInTabNavigator() {
  return (
    <LoggedInTab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: ["Details", "Edit Blog"].includes(route.name) ? () => null : undefined,
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <LoggedInTab.Screen
        name="Blogs"
        component={Blogs}
        initialParams={{ message: "" }}
        options={{
          headerLeft: (props) => (
            <Entypo name="text-document" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedInTab.Screen
        name="Post Blog"
        component={PostBlog}
        options={{
          headerLeft: (props) => (
            <Entypo name="new-message" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedInTab.Screen
        name="My Blogs"
        component={MyBlogs}
        initialParams={{ message: "" }}
        options={{
          headerLeft: (props) => (
            <Feather name="folder" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedInTab.Screen name="Logout" component={Logout} />

      <LoggedInTab.Screen
        name="Details"
        component={BlogInfo}
        options={{
          headerLeft: (props) => (
            <Entypo name="text-document" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedInTab.Screen
        name="Edit Blog"
        component={EditBlog}
        options={{
          headerLeft: (props) => (
            <Feather name="edit" size={24} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />
    </LoggedInTab.Navigator>
  );
}

function LoggedOutTabNavigator() {
  return (
    <LoggedOutTab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: ["Details", "Email Verification", "Email Verification Link", "Change Password Email", "Change Password", "Change Password Link"].includes(route.name) ? () => null : undefined,
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <LoggedOutTab.Screen
        name="Blogs"
        component={Blogs}
        initialParams={{ message: "" }}
        options={{
          headerLeft: (props) => (
            <Entypo name="text-document" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Sign Up"
        component={SignUp}
        options={{
          headerLeft: (props) => (
            <Feather name="user-plus" size={20} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Login"
        component={Login}
        options={{
          headerLeft: (props) => (
            <SimpleLineIcons name="login" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Details"
        component={BlogInfo}
        options={{
          headerLeft: (props) => (
            <Entypo name="text-document" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Email Verification"
        component={EmailSent}
        options={{
          headerLeft: (props) => (
            <Feather name="mail" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Email Verification Link"
        component={EmailVerification}
        options={{
          headerLeft: (props) => (
            <Feather name="link" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Change Password Email"
        component={ChangePasswordEmailSent}
        options={{
          headerLeft: (props) => (
            <Feather name="link" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Change Password"
        component={ChangePassword}
        options={{
          headerLeft: (props) => (
            <Feather name="link" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Change Password Link"
        component={ChangePasswordLink}
        options={{
          headerLeft: (props) => (
            <Feather name="link" size={26} color="black" />
          ),
          headerRight: (props) => (
            <Text style={{ fontSize: 16 }}>
              <Feather name="user" size={24} color="black" />
              User: Not Logged In
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />
    </LoggedOutTab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Recursive_300,
  });

  const linking = {
    prefixes: [prefix, "https://blogger-101.herokuapp.com"],
    config,
  };

  const [isChecking, setIsChecking] = useState(true);

  const [isSignedIn, setIsSignedIn] = useState(null);

  async function getUserData() {
    const username = await SecureStore.getItemAsync("blogger101_Username");
    const password = await SecureStore.getItemAsync("blogger101_Password");
    const email = await SecureStore.getItemAsync("blogger101_Email");
    setGlobalState("username", username);
    setGlobalState("password", password);
    setGlobalState("email", email);
    if (username === null) {
      setIsSignedIn(false);
    } else {
      setIsSignedIn(true);
    }
  }

  if (isChecking) {
    return (
      <AppLoading
        startAsync={getUserData}
        onFinish={() => setIsChecking(false)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isSignedIn ? "LoggedIn" : "LoggedOut"}
      >
        <Stack.Screen name="LoggedIn" component={LoggedInTabNavigator} />
        <Stack.Screen name="LoggedOut" component={LoggedOutTabNavigator} />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
