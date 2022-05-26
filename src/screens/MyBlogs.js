import * as React from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
  Text,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { Snackbar, Card, Title, Provider, Portal, Dialog, Button, Paragraph } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

import styles from "../styles/stylesheet_main";
import SetHeader from "../SetHeaderUser";
import CONSTANTS from "../Constants";
import { getGlobalState } from "../GlobalState";


class MyBlogs extends React.Component {
  constructor() {
    super();
    this.state = {
      entries: [],
      sizes: [],
      screenHeight: Dimensions.get("window").height,
      screenWidth: Dimensions.get("window").width,
      snackbarMessage: "",
      blogToDeleteTitle: "",
      refreshing: false,
      dialogVisible: false,
    };

    this.refreshBlogs = this.refreshBlogs.bind(this);
    this.getSizes = this.getSizes.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
  }

  componentDidMount() {
    this.refreshBlogs();
  }

  refreshBlogs() {
    this.setState({ refreshing: true });
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/blogs`).then(async (response) => {
      var responseInJson = await response.json();
      responseInJson = responseInJson.filter((item) => item.user === getGlobalState("username"))
      for (let blog of responseInJson) {
        this.setState({
          sizes: {
            ...this.state.sizes,
            [blog["image"]]: { width: null, height: null },
          },
        });
      }
      this.getSizes();
      this.setState({ entries: responseInJson });
    }).catch((error) => {
      this.setState({ snackbarMessage: "Please Check Your Network Connection" });
    });
    this.setState({ refreshing: false });
  }

  getSizes() {
    for (let uri of Object.keys(this.state.sizes)) {
      Image.getSize(
        uri,
        (width, height) => {
          let resizedWidth = this.state.screenWidth - 100;
          let resizedHeight = (resizedWidth / width) * height;
          if (resizedHeight > 150) {
            resizedHeight = 150;
            resizedWidth = (150 / height) * width;
          }

          this.setState({
            sizes: {
              ...this.state.sizes,
              [uri]: { width: resizedWidth, height: resizedHeight },
            },
          });
        },
        (error) => console.error(error.message)
      );
    }
  }

  deleteBlog() {
    fetch(`${CONSTANTS.SERVER_URL}/api/v1/delete-blog?` + new URLSearchParams({
        user: getGlobalState("username"),
        title: this.state.blogToDeleteTitle,
    })).then(() => {
      this.setState({ dialogVisible: false, snackbarMessage: "Blog Deleted" });
      this.refreshBlogs();
    }).catch((error) => {
      this.setState({ snackbarMessage: "Please Check Your Network Connection" });
    });
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
        <Snackbar
          visible={true}
          onDismiss={() => this.setState({ snackbarMessage: "" })}
          style={{ marginBottom: 50, color: "black" }}
        >
          {this.state.snackbarMessage}
        </Snackbar>
      );
    }

    return (
      <Provider>
        <Portal>
        <Dialog visible={this.state.dialogVisible} onDismiss={() => this.setState({dialogVisible: false})}>
            <Dialog.Title>Do You Want to Delete <Text style={{ textDecorationLine: "underline" }}>{this.state.blogToDeleteTitle}</Text>?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>This action is irreversable. Are you sure you want to delete <Text style={{ textDecorationLine: "underline" }}>{this.state.blogToDeleteTitle}</Text>?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => this.setState({dialogVisible: false})}>Cancel</Button>
              <Button onPress={this.deleteBlog}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View>
          {snackbar}
          <SetHeader
            navigation={this.props.navigation}
            getGlobalState={getGlobalState}
          />

          <View style={{ height: this.state.screenHeight - 100, marginTop: 15 }}>
            <View style={[styles.container]}>
              <FlatList
                style={{ width: "100%" }}
                data={this.state.entries}
                renderItem={({ item }) => (
                  <View style={{ width: "100%" }}>
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 15,
                      }}
                      onPress={() =>
                        this.props.navigation.navigate("Details", {
                          blogInfo: item,
                        })
                      }
                    >
                      <Card style={{ width: "95%" }}>
                        <Card.Content>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Title>{item.title}</Title>
                            <Text style={{ color: "#009DDC" }}>
                              <Feather name="edit-2" size={13} color="#009DDC" />Edit This Blog
                            </Text>
                            <Text onPress={() => this.setState({ dialogVisible: true, blogToDeleteTitle: item.title })} style={{ color: "#de2720" }}>
                              <Feather name="trash-2" size={13} color="#de2720" />Delete This Blog
                            </Text>
                            <Image
                              source={{ uri: item.image }}
                              style={{
                                width: this.state.sizes[item.image].width,
                                flex: 1,
                                height: this.state.sizes[item.image].height,
                              }}
                            />
                          </View>
                        </Card.Content>
                      </Card>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.link}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.refreshBlogs}
                  />
                }
              />
            </View>
          </View>
        </View>
      </Provider>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();
  return <MyBlogs route={route} navigation={navigation} />;
}
