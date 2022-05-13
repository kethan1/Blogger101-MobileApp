import * as React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesheet_main";
import { getGlobalState, setGlobalState } from "../GlobalState";

var EMAIL_VERIFICATION_RE = /\S+@\S+\.\S+/;

class EmailVerification extends React.Component {
  constructor() {
    super();
    this.state = {};
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

  render() {
    return (
      <View style={[ styles.container ]} >
        <Text>Token: {this.props.token}</Text>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <EmailVerification navigation={navigation} />;
}
