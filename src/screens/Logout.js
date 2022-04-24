import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

class Logout extends React.Component {
  componentDidMount() {}

  render() {
    const { navigation } = this.props;

    SecureStore.deleteItemAsync("blogger101_Email").then(() => {
      SecureStore.deleteItemAsync("blogger101_Username").then(() => {
        SecureStore.deleteItemAsync("blogger101_Password").then(() => {
          navigation.navigate("Blogs", { message: "Successfully Logged Out" });
        });
      });
    });
    return null;
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Logout navigation={navigation} />;
}
