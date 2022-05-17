import * as React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesheet_main";
import { getGlobalState } from "../GlobalState";

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
        <Text>An Email Was Sent to {this.props.route.params.email}</Text>
        <Text>Click on the link in that email to complete your signup. If you have not received an email, check your spam folder.</Text>
      </View>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <EmailSent route={route} navigation={navigation} />;
}
