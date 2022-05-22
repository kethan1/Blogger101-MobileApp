import * as React from "react";
import { View, Text } from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";

import styles from "../styles/stylesheet_main";


class ChangePasswordEmailSent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <View style={[ styles.container, { marginHorizontal: 5 } ]} >
        <Text style={{ fontSize: 17 }}>An Email Was Sent to {this.props.route.params.email}</Text>
        <Text style={{ textAlign: "center" }}>Click on the link in that email to change your password. If you have not received an email, check your spam folder.</Text>
      </View>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <ChangePasswordEmailSent route={route} navigation={navigation} />;
}
