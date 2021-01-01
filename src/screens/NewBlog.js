import * as React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import { Header, Input } from "react-native-elements";
import { Entypo, Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import styles from "../styles/stylesheet_main.js";

class PostBlog extends React.Component {

    constructor(props) {
        super(props);  
        this.state = {
            entries: [],
            ScreenHeight: Dimensions.get("window").height,
            blog_content: "",
            blog_title: "",
            uploadedFile: null
        };
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
            AsyncStorage.getItem("blogger101_Username").then(username => {
                if (username === null) {
                    return setTimeout(() => this.props.navigation.navigate("Blogs", { message: "Please Login or Sign Up to Post a Blog", type: "error", title: "" }))
                } else {
                    AsyncStorage.getItem("blogger101_Username").then(username => {
                        if (username === null) {
                            this.setState({ toDisplayUserLoggedIn: "User Not Logged In" });
                        } else {
                            this.setState({ toDisplayUserLoggedIn: username });
                        }
                    });
                }
            });
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    _pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        this.setState({uploadedFile: result});
    }

    _postBlog = async () => {
        AsyncStorage.getItem("blogger101_Username").then(username => {
            var newBlog = new FormData();
            newBlog.append("blog_title", this.state.blog_title)
            newBlog.append("blog_content", this.state.blog_content)
            newBlog.append("user", username);
            var uploadedFile = this.state.uploadedFile;
            let uriParts = uploadedFile.uri.split(".");
            let fileType = uriParts[uriParts.length - 1];
            var uri = uploadedFile.uri
            newBlog.append("file", {
                uri,
                type: `image/${fileType}`,
                name: `image123123.${fileType}`,
            });

            fetch("https://blogger-101.herokuapp.com/api/add_blog_new", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: newBlog
            })
            this.props.navigation.navigate("Blogs")
        })
        
    }

    render() {
        return (
            <View>
                <Header style={[ styles.header ]} backgroundColor="white" placement="left" centerComponent={{ text: "Post A Blog" }} leftComponent={ <Entypo name="new-message" size={20} color="black" /> } rightComponent={ <View style={[styles.oneLineView]}><Text><Feather name="user" size={18} color="black" />User Logged In: {this.state.toDisplayUserLoggedIn}</Text></View> } />

                <View style={{ height: this.state.ScreenHeight - 100 }}>
                    <Text>{"\n\n"}</Text>
                    <Input
                        placeholder="Blog Title"
                        leftIcon={
                            <Entypo name="text-document" size={24} color="black" />
                        }
                        onChangeText={c => {this.setState({blog_title: c})}}
                    />
                    <Input
                        placeholder="Blog Content"
                        onChangeText={c => {
                            this.setState({blog_content: c});
                        }}
                        multiline={true}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ fontSize: 17 }}>Markdown Preview</Text>
                        <Markdown style={{ body: { fontSize: 17 } }}>
                            { this.state.blog_content }
                        </Markdown>
                    </View>
                    <Button title="Select Image" onPress={this._pickDocument} />
                    <Text>{"\n"}</Text>
                    <Button title="Post Blog" onPress={this._postBlog}/>
                </View>
            </View>
        )
    };
}

export default function(props) {
    const navigation = useNavigation();
  
    return <PostBlog navigation={navigation} />;
}