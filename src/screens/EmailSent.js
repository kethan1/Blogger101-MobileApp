import * as React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesheet_main";
import { getGlobalState, setGlobalState } from "../GlobalState";

var EMAIL_VERIFICATION_RE = /\S+@\S+\.\S+/;

class EmailSent extends React.Component {
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
        <Text>An Email Was Sent to {this.props.email}</Text>
        <Text>Click on the link in that email to complete your signup. If you have not received an email, check your spam folder.</Text>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <EmailSent navigation={navigation} />;
}
