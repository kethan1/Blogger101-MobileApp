import * as React from "react";
import { Text, Dimensions, SafeAreaView, ScrollView } from "react-native";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import { Button, TextInput } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import { SetHeader, OnNavigation } from "../NavigationHelperFuncs";
import { getGlobalState } from "../GlobalState";

class EditBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      ScreenHeight: Dimensions.get("window").height,
      blogContent: "",
      blogTitle: "",
    };

    this.updateBlog = this.updateBlog.bind(this);
    this.getBlogInfo = this.getBlogInfo.bind(this);
  }

  getBlogInfo() {
    this.setState({ blogTitle: this.props.route.params.blogTitle });
    this.setState({ blogContent: this.props.route.params.blogContent });
  }

  updateBlog() {
    if (this.state.blogTitle.length < 5) {
      alert("Please enter a longer title");
      return;
    }
    if (this.state.blogContent.length < 10) {
      alert("Please add more content");
      return;
    }

    fetch(`${CONSTANTS.SERVER_URL}/api/v1/update-blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "title": this.state.blogTitle,
        "old_title": this.props.route.params.blogTitle,
        "blog_content": this.state.blogContent,
        "user": getGlobalState("username"),
      }),
    });
    this.props.navigation.navigate("LoggedIn", {
      screen: "My Blogs",
      props: {
        message: "Successfully Edited Blog",
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", marginTop: "5%" }}>
        <SetHeader
          navigation={this.props.navigation}
          getGlobalState={getGlobalState}
        />

        <OnNavigation
          func={this.getBlogInfo}
        />

        <ScrollView style={{ width: "90%" }}>
          <TextInput
            style={{ marginBottom: 10 }}
            label="Blog Title"
            value={this.state.blogTitle}
            onChangeText={(text) => this.setState({ blogTitle: text })}
            left={<TextInput.Icon
              name={() => <MaterialIcons name="title" size={24} color="black" />}
            />}
            activeOutlineColor="#2196f3"
            activeUnderlineColor="#2196f3"
            selectionColor="#2196f3"
          />

          <TextInput
            style={{ marginBottom: 10 }}
            label="Blog Content"
            value={this.state.blogContent}
            onChangeText={(text) => this.setState({ blogContent: text })}
            left={<TextInput.Icon
              name={() => <Entypo name="text-document" size={24} color="black" />}
            />}
            activeOutlineColor="#2196f3"
            activeUnderlineColor="#2196f3"
            selectionColor="#2196f3"
            multiline={true}
          />
          <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 40, textAlign: "center" }}>
            Markdown Preview
          </Text>
          <Markdown style={{ body: { fontSize: 16 } }}>
            {this.state.blogContent}
          </Markdown>
          <Button
            style={{ marginHorizontal: "3%", marginBottom: "3%", borderRadius: 10 }}
            mode="contained"
            color="#2196f3"
            onPress={this.updateBlog}
          >
            Update Blog
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <EditBlog route={route} navigation={navigation} />;
}
