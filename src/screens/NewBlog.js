import * as React from "react";
import { View, Text, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { Header, Input } from "react-native-elements";
import { Entypo, Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";


class PostBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      ScreenHeight: Dimensions.get("window").height,
      blog_content: "",
      blog_title: "",
      uploadedFile: null,
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        this.setState({ toDisplayUserLoggedIn: "Not Logged In" });
      } else {
        this.setState({ toDisplayUserLoggedIn: username });
      }
    });
    this.props.navigation.setOptions({ headerRight: (props) => (
        <Text style={{ fontSize: 16 }}>
          <Feather name="user" size={24} color="black" />
          User: {this.state.toDisplayUserLoggedIn}
        </Text>
    )});
  }

  async pickDocument() {
    let result = await DocumentPicker.getDocumentAsync({});
    this.setState({ uploadedFile: result });
  }

  async postBlog() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      var newBlog = new FormData();
      newBlog.append("blog_title", this.state.blog_title);
      newBlog.append("blog_content", this.state.blog_content);
      newBlog.append("user", username);
      var uploadedFile = this.state.uploadedFile;
      let uriParts = uploadedFile.uri.split(".");
      let fileType = uriParts[uriParts.length - 1];
      var uri = uploadedFile.uri;
      newBlog.append("file", {
        uri,
        type: `image/${fileType}`,
        name: `image123123.${fileType}`,
      });

      fetch(`${CONSTANTS.SERVER_URL}/api/v1/post-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: newBlog,
      });
      this.props.navigation.navigate("Blogs", {
        message: "Successfully Posted Blog",
      });
    });
  }

  render() {
    return (
      <View>
        <View style={{ height: this.state.ScreenHeight - 100 }}>
          <Text>{"\n\n"}</Text>
          <Input
            placeholder="Blog Title"
            leftIcon={<Entypo name="text-document" size={24} color="black" />}
            onChangeText={(c) => {
              this.setState({ blog_title: c });
            }}
          />
          <Input
            placeholder="Blog Content"
            onChangeText={(c) => {
              this.setState({ blog_content: c });
            }}
            multiline={true}
          />
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 17 }}>Markdown Preview</Text>
            <Markdown style={{ body: { fontSize: 17 } }}>
              {this.state.blog_content}
            </Markdown>
          </View>
          <Button
            color="#2196f3"
            tintColor="white"
            onPress={this.pickDocument}
          >
            Select Image
          </Button>
          <Text>{"\n"}</Text>
          <Button color="#2196f3" tintColor="white" onPress={this.postBlog}>
            Post Blog
          </Button>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <PostBlog navigation={navigation} />;
}
