import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { SimpleLineIcons, Entypo, Feather } from "@expo/vector-icons";
import { useFonts, Recursive_300 } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import * as SecureStore from "expo-secure-store";

import Blogs from "./src/screens/Blogs.js";
import Blog_Info from "./src/screens/DetailsScreen.js";
import Login from "./src/screens/Login.js";
import Sign_Up from "./src/screens/Sign_up.js";
import Logout from "./src/screens/Logout.js";
import PostBlog from "./src/screens/NewBlog.js";

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Recursive_300,
  });

  const [isChecking, setIsChecking] = useState(true);

  const [isSignedIn, setIsSignedIn] = useState(null);

  async function getUserData() {
    const username = await SecureStore.getItemAsync("blogger101_Username");
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
    <NavigationContainer>
      <Tab.Navigator
        independent={true}
        screenOptions={({ route }) => ({
          tabBarButton: [
            "Details",
            isSignedIn ? "Login" : "Post_Blog",
            // isSignedIn ? "Sign_Up": "Logout",
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
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Blogs"
          component={Blogs}
          initialParams={{ message: "" }}
        />
        <Tab.Screen name="Post_Blog" component={PostBlog} />
        <Tab.Screen name="Sign_Up" component={Sign_Up} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Logout" component={Logout} />
        <Tab.Screen name="Details" component={Blog_Info} />
      </Tab.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
