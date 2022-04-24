import * as React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { Header, Input } from "react-native-elements";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import styles from "../styles/stylesheet_main.js";

class Blog_Info extends React.Component {
  constructor() {
    super();
    this.state = {
      blog_comments: [],
      ScreenHeight: Dimensions.get("window").height,
      ScreenWidth: Dimensions.get("window").width,
      isSubPost: [false, null],
    };
  }

  componentDidMount() {
    this.refreshBlogComments();
  }

  refreshBlogComments() {
    fetch(
      `https://blogger-101.herokuapp.com/api/v1/blog-comments/${this.props.route.params.blog_info.title}`,
      {
        mode: "cors",
        cache: "no-cache",
      }
    ).then(async (response) => {
      var responseInJson = await response.json();
      this.setState({ blog_comments: responseInJson });
    });
  }

  postCommentChangeType(commentType) {
    if (commentType === "main") {
      this.setState({ isSubPost: [false, null] });
    } else {
      this.setState({ isSubPost: [true, commentType] });
    }
  }

  post_comment() {
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        alert("Please Login to Post a Blog");
      } else {
        if (this.state.isSubPost[0] === false) {
          fetch("https://blogger-101.herokuapp.com/api/v1/add-comment", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blog_title: this.props.route.params.blog_info.title,
              type: "main",
              comment_content: this.state.comment_content,
              user: username,
            }),
          });
        } else {
          fetch("https://blogger-101.herokuapp.com/api/v1/add-comment", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blog_title: this.props.route.params.blog_info.title,
              type: "sub",
              comment_content: this.state.comment_content,
              id: this.state.isSubPost[1],
              user: username,
            }),
          });
        }
        this.refreshBlogComments();
      }
    });
  }

  return_blog_comments_view() {
    var to_return = [];
    for (let comment of this.state.blog_comments) {
      var comment_text = `${comment["text"]} - ${comment["user"]}`;
      var comment_id = comment["id"];
      to_return.push(
        <View>
          <Markdown style={{ body: { fontSize: 16 } }}>{comment_text}</Markdown>
          <Text
            onPress={() => this.postCommentChangeType(`${comment_id}`)}
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
    SecureStore.getItemAsync("blogger101_Username").then((username) => {
      if (username === null) {
        this.setState({ toDisplayUserLoggedIn: "User Not Logged In" });
      } else {
        this.setState({ toDisplayUserLoggedIn: username });
      }
    });
  }

  render() {
    const { route } = this.props;

    return (
      <View>
        <Header
          style={[styles.header]}
          backgroundColor="white"
          placement="left"
          centerComponent={{ text: route.params.blog_info.title }}
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

        <View
          style={{
            height: this.state.ScreenHeight - 100,
            marginRight: "5%",
            marginLeft: "5%",
            marginTop: "2%",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            {route.params.blog_info.title}
            {"\n"}
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
                  {route.params.blog_info.text}
                </Markdown>
              </View>
              <Text>{"\n"}</Text>
              <Text
                onPress={() => this.refreshBlogComments()}
                style={{ marginLeft: "5%" }}
              >
                <Feather name="refresh-ccw" size={20} color="black" />
                &nbsp;Refresh Blog Comments
              </Text>
              <Text
                onPress={() => this.postCommentChangeType("main")}
                style={{ fontSize: 15, color: "blue", marginLeft: "5%" }}
              >
                Respond To This Blog
              </Text>
              <Text>{"\n\n\n"}</Text>

              <View
                style={{
                  marginRight: "5%",
                  marginLeft: this.state.isSubPost[0] ? "15%" : "5%",
                }}
              >
                <Input
                  placeholder="Comment Content"
                  onChangeText={(c) => {
                    this.setState({ comment_content: c });
                  }}
                  multiline={true}
                  style={{ width: this.state.ScreenWidth }}
                />
                <Text onPress={() => this.post_comment()}>Post Comment</Text>
                <Text>{"\n\n"}</Text>
              </View>
              {this.return_blog_comments_view()}
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

  return <Blog_Info route={route} navigation={navigation} />;
}
