import * as React from "react";
import { View, Text, Dimensions, Button, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Header, Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import styles from "../styles/stylesheet_main.js"

class Sign_Up extends React.Component {

    constructor() {
        super();
        
        this.state = {
            entries: [],
            ScreenHeight: Dimensions.get("window").height,
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirm_password: "",
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
        if (this.state.password === this.state.confirm_password) {
            fetch("https://blogger-101.herokuapp.com/api/add_user/", { 
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        first_name: this.state.first_name,
                        last_name: this.state.last_name,
                        username: this.state.username,
                        email: this.state.email,
                        password: this.state.password
                    })    
                }
            ).then(async (response) => {
                const data = await response.json();
                if (data.success) {
                    AsyncStorage.setItem("blogger101_Email", this.state.email);
                    AsyncStorage.setItem("blogger101_Username", this.state.username);
                    AsyncStorage.setItem("blogger101_Password", this.state.password);
                    this.props.navigation.navigate("Blogs", { message: "Successfully Signed Up", type: "success" })
                } else {
                    let StringToDisplay = ""
                    if (data.already === "both") {
                        StringToDisplay = "Username and email taken"
                    } else {
                        StringToDisplay = `${data.already} taken` 
                    }
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: `${StringToDisplay}`,
                        topOffset: 60
                    });
                }
            });
        } else {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Confirm Password Does Not Match Password",
                topOffset: 60
            });
        }
    }

    render() {
        return (
            <View>
                <Header style={{ marginTop: 0, shadowOffset: { width: 100,  height: 100 }, shadowColor: "black", shadowOpacity: 1.0 }} backgroundColor="white" placement="left" centerComponent={{ text: "Sign Up" }} leftComponent={<Feather name="user-plus" size={20} color="black" />} rightComponent={ <View style={[styles.oneLineView]}><Text><Feather name="user" size={18} color="black" />User Logged In: {this.state.toDisplayUserLoggedIn}</Text></View> } />
                
                <View style={{ height: this.state.ScreenHeight - 100 }}>
                    <View style={[ styles.container ]}>
                        
                        <View style={{ width: "90%" }}>

                            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={(this.state.ScreenHeight/2)-150}>
                                
                                <View style={{ flexDirection:'row', width: "100%" }}>
                                    <View style={{ width: "50%" }}>
                                        <Input
                                            placeholder="First Name"
                                            leftIcon={ <Feather name="user" size={24} color="black" /> }
                                            onChangeText={c => { this.first_name = c; }}
                                        />
                                    </View>
                                    <View style={{ width: "50%" }}>
                                        <Input
                                            placeholder="Last Name"
                                            leftIcon={ <Feather name="user" size={24} color="black" /> }
                                            onChangeText={c => { this.last_name = c; }}
                                        />
                                    </View>
                                </View>


                                <Input
                                    placeholder="Username"
                                    leftIcon={ <Feather name="user" size={24} color="black" /> }
                                    onChangeText={c => { this.username = c; }}
                                />

                                <Input
                                    placeholder="Email"
                                    leftIcon={ <MaterialCommunityIcons name="email-outline" size={24} color="black" /> }
                                    onChangeText={c => { this.email = c; }}
                                />

                                <Input
                                    placeholder="Password"
                                    leftIcon={ <Feather name="lock" size={24} color="black" /> }
                                    onChangeText={c => { this.password = c; }}
                                    secureTextEntry={true}
                                />

                                <Input
                                    placeholder="Confirm Password"
                                    leftIcon={ <Feather name="lock" size={24} color="black" /> }
                                    onChangeText={c => { this.confirm_password = c; }}
                                    secureTextEntry={true}
                                />

                                <View style={{ marginTop: 1 }}>
                                    <Button
                                        title="Submit"
                                        onPress={() => this.check_user()}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <Sign_Up navigation={navigation} />;
}