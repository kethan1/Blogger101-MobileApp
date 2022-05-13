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
import Blog_Info from "./src/screens/BlogTemplate";
import Login from "./src/screens/Login";
import Sign_Up from "./src/screens/SignUp";
import Logout from "./src/screens/Logout";
import PostBlog from "./src/screens/PostBlog";
import EmailSent from "./src/screens/EmailSent";
import EmailVerification from "./src/screens/EmailVerification";

import { getGlobalState, setGlobalState } from "./src/GlobalState";

const LoggedOutTab = createBottomTabNavigator();
const LoggedInTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const prefix = Linking.createURL('/');
const config = {
  screens: {
    "Email Verification": "email_verification/:token",
  },
}

function getTabBarIcon(route) {
  return ({ focused, color, size }) => {
    if (route.name === "Blogs") {
      return <Entypo name="text-document" size={size} color={color} />;
    } else if (route.name === "Post_Blog") {
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
    }
  };
}

function LoggedInTabNavigator() {
  return (
    <LoggedInTab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: route.name === "Details" ? () => null : undefined,
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
        name="Post_Blog"
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

      <LoggedInTab.Screen name="Logout" component={Logout} />

      <LoggedInTab.Screen
        name="Details"
        component={Blog_Info}
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
    </LoggedInTab.Navigator>
  );
}

function LoggedOutTabNavigator() {
  return (
    <LoggedOutTab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: ["Email Verification", "Details", "Email Verification Link"].includes(route.name) ? () => null : undefined,
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
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Sign Up"
        component={Sign_Up}
        options={{
          headerLeft: (props) => (
            <Feather name="user-plus" size={20} color="black" />
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
              User: {getGlobalState("username")}
            </Text>
          ),
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerRightContainerStyle: { paddingRight: 10 },
        }}
      />

      <LoggedOutTab.Screen
        name="Details"
        component={Blog_Info}
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
              User: {getGlobalState("username")}
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
              User: {getGlobalState("username")}
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
    prefixes: [prefix],
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
  } else {
    if (getGlobalState("username") === null && isSignedIn !== false) {
      setIsSignedIn(false);
    } else if (getGlobalState("username") !== null && isSignedIn !== true) {
      setIsSignedIn(true);
    }
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
