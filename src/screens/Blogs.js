import * as React from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import CONSTANTS from "../Constants";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Snackbar, Card, Title } from "react-native-paper";
import styles from "../styles/stylesheet_main";
import { getGlobalState, setGlobalState } from "../GlobalState";

class Blogs extends React.Component {
  constructor() {
    super();
    this.state = {
      entries: [],
      screenHeight: Dimensions.get("window").height,
      screenWidth: Dimensions.get("window").width,
      snackbarMessage: "",
    };
  }

  componentDidMount() {
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/blogs`).then(
      async (response) => {
        var responseInJson = await response.json();
        this.setState({ entries: responseInJson });
      }
    );
    this.props.navigation.setOptions({ headerRight: (props) => (
      <Text style={{ fontSize: 16 }}>
        <Feather name="user" size={24} color="black" />
        User: {getGlobalState("username")}
      </Text>
    )});
  }

  refresh_blogs() {
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/blogs`).then(
      async (response) => {
        var responseInJson = await response.json();
        this.setState({ entries: responseInJson });
      }
    );
  }

  render() {
    const { route } = this.props;

    if (route.params.message) {
        this.state.snackbarMessage = route.params.message || "";
        route.params.message = "";
    }
    let snackbar = null;
    if (this.state.snackbarMessage !== "") {
      snackbar = (
        <Snackbar visible={true} onDismiss={() => this.setState({snackbarMessage: ""})} style={{ marginBottom: 50, color: "black" }}>{this.state.snackbarMessage}</Snackbar>
      );
    }

    return (
      <View>
        {snackbar}

        <View style={{ height: this.state.screenHeight - 100 }}>
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
                      <Card.Content>
                        <Title>{item.title}</Title>
                        <Image source={{ uri: item.image }} style={{ width: this.state.screenWidth - 10, flex: 1, height: null }} />
                      </Card.Content>
                      
                    </Card>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 15 }}>{"\n"}</Text>
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

export default function(props) {
  const route = useRoute();
  const navigation = useNavigation();
  return <Blogs route={route} navigation={navigation} />;
}
