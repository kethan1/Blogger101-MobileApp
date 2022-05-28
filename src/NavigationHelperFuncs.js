import * as React from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export function SetHeader({ navigation, getGlobalState }) {
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: (props) => (
          <Text style={{ fontSize: 16 }}>
          <Feather name="user" size={24} color="black" />
          User: {getGlobalState("username") == null ? "Not Logged In": getGlobalState("username")}
          </Text>
        ),
      });

      return () => null;
    }, [navigation, getGlobalState])
  );

  return null;
}

export function OnNavigation({ func }) {
  useFocusEffect(
    React.useCallback(() => {
      func();
      return () => null;
    }, [func])
  );

  return null;
}
