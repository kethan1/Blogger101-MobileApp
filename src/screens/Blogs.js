import * as React from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Header, Card } from "react-native-elements";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Snackbar } from "react-native-paper";
import styles from "../styles/stylesheet_main.js";

class Blogs extends React.Component {
  constructor() {
    super();
    this.state = {
      entries: [],
      ScreenHeight: Dimensions.get("window").height,
    };
  }

  componentDidMount() {
    fetch("https://blogger-101.herokuapp.com/api/v1/blogs").then(
      async (response) => {
        var responseInJson = await response.json();
        this.setState({ entries: responseInJson });
      }
    );
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        this.setState({ toDisplayUserLoggedIn: "User Not Logged In" });
      } else {
        this.setState({ toDisplayUserLoggedIn: username });
      }
    });
  }

  refresh_blogs() {
    fetch("https://blogger-101.herokuapp.com/api/v1/blogs").then(
      async (response) => {
        var responseInJson = await response.json();
        this.setState({ entries: responseInJson });
      }
    );
  }

  render() {
    const { route } = this.props;
    let snackbar = null;
    if (route.params.message !== "") {
      snackbar = (
        <Snackbar visible={true}>{this.state.snackbar_message}</Snackbar>
      );
    }

    return (
      <View>
        {snackbar}
        <Header
          style={[styles.header]}
          backgroundColor="white"
          placement="left"
          centerComponent={{ text: "Blogs" }}
          leftComponent={
            <Entypo name="text-document" size={20} color="black" />
          }
          rightComponent={
            <View style={[styles.oneLineView]}>
              <Text>
                <Feather name="user" size={18} color="black" />
                User Logged In: {this.state.toDisplayUserLoggedIn}
              </Text>
            </View>
          }
        />

        <View style={{ height: this.state.ScreenHeight - 100 }}>
          <Text
            style={{ marginRight: 5, textAlign: "right", fontSize: 15 }}
            onPress={() => this.refresh_blogs()}
          >
            <Feather name="refresh-ccw" size={17} color="black" />
            &nbsp;Refresh Blogs
          </Text>

          <Text
            style={{
              marginRight: 5,
              textAlign: "right",
              color: "blue",
              fontSize: 15,
            }}
            onPress={() => this.props.navigation.navigate("Post_Blog")}
          >
            {"\n"}New Blog
          </Text>

          <View style={[styles.container]}>
            <FlatList
              style={{ width: "100%" }}
              data={this.state.entries}
              renderItem={({ item }) => (
                <View style={{ width: "100%" }}>
                  <TouchableOpacity
                    style={{ width: "100%" }}
                    onPress={() =>
                      this.props.navigation.navigate("Details", {
                        blog_info: item,
                      })
                    }
                  >
                    <Card style={{ width: "100%" }}>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Divider />
                      <Card.Image
                        style={{ width: "100%" }}
                        source={{ uri: item.image }}
                        resizeMode="center"
                      />
                    </Card>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.link}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();
  return <Blogs route={route} navigation={navigation} />;
}
