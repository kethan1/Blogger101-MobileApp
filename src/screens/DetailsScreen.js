import * as React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { Header, Input } from "react-native-elements";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";
import styles from "../styles/stylesheet_main.js"

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
        fetch("https://blogger-101.herokuapp.com/api/get_blog_comments", { 
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "blog_title": this.props.route.params.blog_info.title
            })
        }).then(async (response) => {
            var responseInJson = await response.json();
            this.setState({ blog_comments: responseInJson });
        });
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
            AsyncStorage.getItem("blogger101_Username").then(username => {
                if (username === null) {
                    this.setState({ toDisplayUserLoggedIn: "User Not Logged In" });
                } else {
                    this.setState({ toDisplayUserLoggedIn: username });
                }
            });
        });
    }

    refresh_blog_comments() {
        fetch("https://blogger-101.herokuapp.com/api/get_blog_comments", { 
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "blog_title": this.props.route.params.blog_info.title
            })
        }).then(async (response) => {
            var responseInJson = await response.json();
            this.setState({ blog_comments: responseInJson });
        });        
    }

    post_comment_change_type(e) {
        if (e === "main") {
            this.setState({isSubPost: [false, null]});
        } else {
            this.setState({isSubPost: [true, e]});
        }
    }

    post_comment() {
        AsyncStorage.getItem("blogger101_Username").then(username => {
            if (username === null) {
                alert("Please Login to Post a Blog")
            } else {
                if (this.state.isSubPost[0] === false) {
                    fetch("https://blogger-101.herokuapp.com/api/add_comment", { 
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            blog_title: this.props.route.params.blog_info.title,
                            type: "main",
                            comment_content: this.state.comment_content,
                            user: username
                        })
                    })     
                } else {
                    fetch("https://blogger-101.herokuapp.com/api/add_comment", { 
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            blog_title: this.props.route.params.blog_info.title,
                            type: "sub",
                            comment_content: this.state.comment_content,
                            id: this.state.isSubPost[1],
                            user: username
                        })
                    })
                }
                this.refresh_blog_comments();
            }
        })
    }

    return_blog_comments_view() {
        var blog_comments = this.state.blog_comments.found;
        var to_return = [];
        for (var i = 0; i < this.state.blog_comments.number_of_comments; i++) {
            var tmp_x = blog_comments[i][0]+" - "+blog_comments[i][1];
            var comment_id = blog_comments[i][2];
            to_return.push(<View>
                <Markdown style={{ body: { fontSize: 16 } }}>{tmp_x}</Markdown>
                <Text 
                    onPress={() => this.post_comment_change_type(`${comment_id}`)} 
                    style={{ fontSize: 14, color: "blue" }}
                >
                Respond To This Comment</Text>
            </View>);
            for (var z = 0; z < blog_comments[i][3].length; z++) {
                var tmp_y = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;&nbsp;"+blog_comments[i][3][z][0]+" - "+blog_comments[i][3][z][1]
                to_return.push(<Markdown style={{ body: {fontSize: 16} }}>{tmp_y}</Markdown>);
            }
        }
        return to_return.map((comment, index) =>
            <View style={{ marginLeft: "5%" }} key={index}>
                {comment}
            </View>
        );
    }

    render() {
        const { route } = this.props;

        return (
            <View>
                <Header style={[ styles.header ]} backgroundColor="white" placement="left" centerComponent={{ text: route.params.blog_info.title }} leftComponent={ <Entypo name="text-document" size={20} color="black" /> } rightComponent={ <View style={[styles.oneLineView]}><Text><Feather name="user" size={18} color="black" />User Logged In: {this.state.toDisplayUserLoggedIn}</Text></View> } />
                
                <View style={{ height: this.state.ScreenHeight - 100 }}>
                    <Text style={{ fontSize: 33, textAlign: "center" }}>{route.params.blog_info.title}{"\n"}</Text>
                    <View>
                        <ScrollView style={{ width: "100%" }}>
                            <View style={{ marginRight: "5%", marginLeft: "5%", width: "90%", textAlign: "center" }}>
                                <Markdown style={{ body: {fontSize: 18} }}>
                                    {route.params.blog_info.text}
                                </Markdown>
                            </View>
                            <Text>{"\n"}</Text>
                            <Text onPress={() => this.refresh_blog_comments()} style={{ marginLeft: "5%" }}><Feather name="refresh-ccw" size={20} color="black" />&nbsp;Refresh Blog Comments</Text>
                            <Text onPress={() => this.post_comment_change_type("main")} style={{ fontSize: 15, color: "blue", marginLeft: "5%" }}>
                            Respond To This Blog</Text>
                            <Text>{"\n\n\n"}</Text>
                            
                            <View style={{ marginRight: "5%", marginLeft: this.state.isSubPost[0] ? "15%": "5%" }}>
                                <Input
                                    placeholder="Comment Content"
                                    onChangeText={c => {
                                        this.setState({comment_content: c});
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


export default function(props) {
    const route = useRoute();
    const navigation = useNavigation();

    return <Blog_Info route={route} navigation={navigation} />;
}
