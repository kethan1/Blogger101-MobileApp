import * as React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";

import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRoute, useNavigation } from "@react-navigation/native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { TextInput } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import { SetHeader } from "../NavigationHelperFuncs";
import { getGlobalState } from "../GlobalState";


class BlogInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      blog_comments: [],
      screenHeight: Dimensions.get("window").height,
      screenWidth: Dimensions.get("window").width,
      subPostId: null,
    };

    this.switchCommentType = this.switchCommentType.bind(this);
    this.postComment = this.postComment.bind(this);
    this.refreshBlogComments = this.refreshBlogComments.bind(this);
  }

  refreshBlogComments() {
    fetch(
      `${CONSTANTS.SERVER_URL}/api/v1/blog-comments/${this.props.route.params.blogInfo.title}`,
      {
        mode: "cors",
        cache: "no-cache",
      }
    ).then(async (response) => {
      var responseInJson = await response.json();
      this.setState({ blog_comments: responseInJson });
    });
  }

  switchCommentType(commentId = null) {
    this.setState({ subPostId: commentId });
  }

  postComment() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        // TODO: use snackbar instead of alert
        alert("Please Login to Post a Comment");
      } else {
        if (this.state.subPostId === null) {
          fetch(`${CONSTANTS.SERVER_URL}/api/v1/add-comment`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blog_title: this.props.route.params.blogInfo.title,
              type: "main",
              commentContent: this.state.commentContent,
              user: username,
            }),
          });
        } else {
          fetch(`${CONSTANTS.SERVER_URL}/api/v1/add-comment`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blog_title: this.props.route.params.blogInfo.title,
              type: "sub",
              commentContent: this.state.commentContent,
              id: this.state.subPostId,
              user: username,
            }),
          });
        }
        this.refreshBlogComments();
      }
    });
  }

  renderBlogComments() {
    var to_return = [];
    for (let comment of this.state.blog_comments) {
      var commentText = `${comment["text"]} - ${comment["user"]}`;
      var commentID = comment["id"];
      to_return.push(
        <View>
          <Markdown style={{ body: { fontSize: 16 } }}>{commentText}</Markdown>
          <Text
            onPress={() => this.switchCommentType(commentID)}
            style={{ fontSize: 14, color: "blue" }}
          >
            Respond To This Comment
          </Text>
        </View>
      );
      for (let sub_comment of comment["sub_comments"]) {
        var markdown_text = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;&nbsp${sub_comment["text"]} - ${sub_comment["user"]}`;
        to_return.push(
          <Markdown style={{ body: { fontSize: 16 } }}>
            {markdown_text}
          </Markdown>
        );
      }
    }
    return to_return.map((comment, index) => (
      <View style={{ marginLeft: "5%" }} key={index}>
        {comment}
      </View>
    ));
  }

  componentDidMount() {
    this.refreshBlogComments();
    this.props.navigation.setOptions({
      title: this.props.route.params.blogInfo.title,
    });
  }

  render() {
    const { route } = this.props;

    return (
      <View>
        <SetHeader
          navigation={this.props.navigation}
          getGlobalState={getGlobalState}
        />

        <View
          style={{
            height: this.state.screenHeight - 100,
            marginRight: "5%",
            marginLeft: "5%",
            marginTop: "2%",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center", marginBottom: 10, marginTop: 10 }}>
            {route.params.blogInfo.title}
          </Text>
          <View>
            <ScrollView style={{ width: "100%" }}>
              <View
                style={{
                  marginRight: "5%",
                  marginLeft: "5%",
                  width: "90%",
                  textAlign: "center",
                }}
              >
                <Markdown
                  markdownit={MarkdownIt({ typographer: true, linkify: true })}
                  style={{ body: { fontSize: 15 }, link: { color: "blue" } }}
                  mergeStyle={true}
                >
                  {route.params.blogInfo.text}
                </Markdown>
              </View>
              <Text>{"\n"}</Text>
              <Text
                onPress={this.refreshBlogComments}
                style={{ marginLeft: "5%" }}
              >
                <Feather name="refresh-ccw" size={20} color="black" />
                &nbsp;Refresh Blog Comments
              </Text>
              <Text
                onPress={this.switchCommentType}
                style={{ fontSize: 15, color: "blue", marginLeft: "5%" }}
              >
                Respond To This Blog
              </Text>
              <Text>{"\n\n\n"}</Text>

              <View
                style={{
                  marginRight: "5%",
                  marginLeft: this.state.subPostId !== null ? "15%" : "5%",
                }}
              >
                <TextInput
                  label="Comment Content"
                  value={this.state.commentContent}
                  onChangeText={(text) =>
                    this.setState({ commentContent: text })
                  }
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Feather name="lock" size={24} color="black" />
                      )}
                    />
                  }
                  activeOutlineColor="#2196f3"
                  activeUnderlineColor="#2196f3"
                  selectionColor="#2196f3"
                  multiline={true}
                  style={{ width: this.state.screenWidth }}
                />
                <Text onPress={this.postComment}>Post Comment</Text>
                <Text>{"\n\n"}</Text>
              </View>
              {this.renderBlogComments()}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

export default function (props) {
  const route = useRoute();
  const navigation = useNavigation();

  return <BlogInfo route={route} navigation={navigation} />;
}
