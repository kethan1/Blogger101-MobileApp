import * as React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native-elements";
import { SimpleLineIcons, Feather } from "@expo/vector-icons"; 
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesheet_main.js";

class Logout extends React.Component {

    constructor() {
        super();
        this.state = {
            ScreenHeight : Dimensions.get("window").height,
        };
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
            AsyncStorage.getItem("blogger101_Username").then(username => {
                if (username === null) {
                    this.props.navigation.navigate("Blogs", { message: "Not Logged In", type: "error", title: "" })
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

    render() {
        const { navigation } = this.props;
        return ( 
            <View>
                <Header style={[ styles.header ]} backgroundColor="white" placement="left" centerComponent={{ text: "Logout" }} leftComponent={ <SimpleLineIcons name="logout" size={20} color="black" /> } rightComponent={ <View style={[styles.oneLineView]}><Text><Feather name="user" size={18} color="black" />User Logged In: {this.state.toDisplayUserLoggedIn}</Text></View> } />

                    <View style={{ height: this.state.ScreenHeight - 100 }}>
                        <View style={[ styles.container ]}>
                            <Text>Are You Sure You Want to Logout</Text>      
                            <Button
                                title="Yes"
                                onPress={function() {
                                    AsyncStorage.removeItem("blogger101_Email").then(() => {
                                        AsyncStorage.removeItem("blogger101_Username").then(() => {
                                            AsyncStorage.removeItem("blogger101_Password").then(() => {
                                                navigation.navigate("Blogs", { message: "Sucessfully Logged Out", type: "success", title: "" });
                                            });
                                        });                                    
                                    });
                                    
                                }}
                            />
                    </View>
                </View>
            </View>
            
        );
    }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <Logout navigation={navigation} />;
}