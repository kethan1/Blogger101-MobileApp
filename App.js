import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { SimpleLineIcons, Entypo, Feather } from "@expo/vector-icons";
import { useFonts, Recursive_300 } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import * as SecureStore from "expo-secure-store";

import Blogs from "./src/screens/Blogs";
import Blog_Info from "./src/screens/DetailsScreen";
import Login from "./src/screens/Login";
import Sign_Up from "./src/screens/Sign_up";
import Logout from "./src/screens/Logout";
import PostBlog from "./src/screens/NewBlog";

import { getGlobalState, setGlobalState } from "./src/GlobalState";

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Recursive_300,
  });

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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarButton: [
            "Details",
          ].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Blogs") {
              return <Entypo name="text-document" size={size} color={color} />;
            } else if (route.name === "Post_Blog") {
              return <Entypo name="new-message" size={size} color={color} />;
            } else if (route.name === "Login") {
              return <SimpleLineIcons name="login" size={size} color={color} />;
            } else if (route.name === "Sign_Up") {
              return <Feather name="user-plus" size={size} color={color} />;
            } else if (route.name === "Logout") {
              return (
                <SimpleLineIcons name="logout" size={size} color={color} />
              );
            }
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
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
  
        {isSignedIn ? (
          <Tab.Screen
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
        ) : <Tab.Screen
            name="Sign_Up"
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
        }

        {isSignedIn ? (
          <Tab.Screen name="Logout" component={Logout} />
        ) : <Tab.Screen
            name="Login"
            component={Login}
            options={{
              headerLeft: (props) => (
                <SimpleLineIcons name="login" size={26} color="black" />
              ),
              headerLeftContainerStyle: { paddingLeft: 10 },
              headerRightContainerStyle: { paddingRight: 10 },
            }}
          />
        }
        
        <Tab.Screen name="Details" component={Blog_Info} />
      </Tab.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
