import * as React from "react";
import { View, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import { SimpleLineIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Input, Header } from "react-native-elements";
import { Button } from "react-native-material-ui";
import styles from "../styles/stylesheet_main.js"

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            response: [],
            ScreenHeight: Dimensions.get("window").height,
            email: "",
            password: ""
        };
        this.check_user = this.check_user.bind(this);
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
            AsyncStorage.getItem("blogger101_Username").then(username => {
                if (username !== null) {
                    return setTimeout(() => this.props.navigation.navigate("Blogs", { message: "Already Logged In", type: "error", title: "" }))
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
    
    check_user() {
        fetch("https://blogger-101.herokuapp.com/api/check_user/", { 
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email.trim().toLowerCase(),
                password: this.state.password
            })    
        }).then(async (response) => {
            const data = await response.json();
            if (data.found) {
                AsyncStorage.setItem("blogger101_Email", this.state.email);
                AsyncStorage.setItem("blogger101_Username", data.user_found);
                AsyncStorage.setItem("blogger101_Password", this.state.password);
                this.props.navigation.navigate("Blogs", { message: "Logged In Successfully", type: "success", title: "" })
            } else {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "The Entered Email or Password Is Wrong",
                    topOffset: 60
                });
            }
        });
    }

    render() {
        return (
            <View>
                <Header style={[ styles.header ]} backgroundColor="white" placement="left" centerComponent={{ text: "Login" }} leftComponent={<SimpleLineIcons name="login" size={20} color="black" />} rightComponent={ <View style={[styles.oneLineView]}><Text><Feather name="user" size={18} color="black" />User Logged In: {this.state.toDisplayUserLoggedIn}</Text></View> } />

                <View style={{ height: this.state.ScreenHeight - 100 }}>
                    <View style={[ styles.container ]}>

                            <KeyboardAvoidingView
                                behavior="position" keyboardVerticalOffset={140}
                                style={{ width: "90%" }}>
                                
                                <Input
                                    placeholder="Email"
                                    leftIcon={
                                        <MaterialCommunityIcons name="email-outline" size={24} color="black" />
                                    }
                                    onChangeText={(c) => this.setState({ email: c })}
                                />

                                <Input
                                    placeholder="Password"
                                    leftIcon={
                                        <Feather name="lock" size={24} color="black" />
                                    }
                                    onChangeText={(c) => this.setState({ password: c })}
                                    secureTextEntry={true}
                                />

                                <View style={{ marginTop: 1 }}>
                                    <Button
                                        raised
                                        primary
                                        text="Submit"
                                        onPress={() => this.check_user()}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                    </View>
                </View>
            </View>
        );
    }
}


export default function(props) {
    const navigation = useNavigation();
  
    return <Login navigation={navigation} />;
}