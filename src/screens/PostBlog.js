import * as React from "react";
import { Text, Dimensions, Image, SafeAreaView, ScrollView } from "react-native";

import { Entypo, MaterialIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import { Button, TextInput } from "react-native-paper";

import styles from "../styles/stylesheet_main";
import CONSTANTS from "../Constants";
import SetHeader from "../SetHeaderUser";
import { getGlobalState } from "../GlobalState";

class PostBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      ScreenHeight: Dimensions.get("window").height,
      blogContent: "",
      blogTitle: "",
      uploadedFile: null,
      imageUri: null,
    };

    this.pickDocument = this.pickDocument.bind(this);
    this.postBlog = this.postBlog.bind(this);
  }

  async pickDocument() {
    let uploadedFile = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!uploadedFile.cancelled) {
      var uri = uploadedFile.uri;
      this.setState({ uploadedFile: uploadedFile });
      this.setState({ imageUri: uri });
    }
  }

  async postBlog() {
    var blogFormData = new FormData();
    blogFormData.append("title", this.state.blogTitle);
    blogFormData.append("blog_content", this.state.blogContent);
    blogFormData.append("user", getGlobalState("username"));
    var uri = this.state.imageUri;
    if (uri === null) {
      alert("Please select an image");
      return;
    }
    if (this.state.blogTitle.length < 5) {
      alert("Please enter a longer title");
      return;
    }
    if (this.state.blogContent.length < 10) {
      alert("Please add more content");
      return;
    }

    var splitUri = uri.split(".");
    var fileType = splitUri[splitUri.length - 1];
    blogFormData.append("file", {
      uri,
      type: `image/${fileType}`,
      name: `image.${fileType}`,
    });

    fetch(`${CONSTANTS.SERVER_URL}/api/v1/post-blog`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: blogFormData,
      user: getGlobalState("username")
    });
    this.props.navigation.navigate("Blogs", {
      message: "Successfully Posted Blog",
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", marginTop: "5%" }}>
        <SetHeader
          navigation={this.props.navigation}
          getGlobalState={getGlobalState}
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
          <Button color="#2196f3" tintColor="white" onPress={this.pickDocument}>
            <Feather name="file-plus" size={20} color="black" />Upload Image
          </Button>
          {
            this.state.imageUri !== null && <Image source={{ uri: this.state.imageUri }} style={{ width: 200, height: 200, alignSelf: "center", marginBottom: 15, marginTop: 5 }} />
          }
          <Button
            style={{ marginHorizontal: "3%", marginBottom: "3%", borderRadius: 10 }}
            mode="contained"
            color="#2196f3"
            onPress={this.postBlog}
          >
            Post Blog
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <PostBlog navigation={navigation} />;
}
