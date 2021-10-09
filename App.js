import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SvgUri } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";

import Loading from "./components/loading";
import MarketScreen from "./components/market";
import NewsScreen from "./components/news";

const Tab = createBottomTabNavigator();

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: 1, exp: 0 };
    }

    componentDidMount() {
        (async () => {
            try {
                const value = JSON.parse(await AsyncStorage.getItem("@api_token"));
                if (value === null) {
                    this.setState({
                        status: 2,
                    });
                } else {
                    this.setState({
                        status: 3,
                        api_token: value,
                    });
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }

    handleStart = () => {
        (async () => {
            try {
                this.setState((prevState) => ({
                    status: 1,
                }));
                let token = 123123123;
                // const response = await fetch(
                //     "https://mywebsite.com/endpoint/",
                //     {
                //         method: "POST",
                //         headers: {
                //             Accept: "application/json",
                //             "Content-Type": "application/json",
                //             Authorization: "Bearer " + this.api_token,
                //         },
                //         body: JSON.stringify({
                //             age: "123",
                //             experience: "1",
                //             blueprint: "123",
                //         }),
                //     }
                // );
                // const json = await response.json();
                // token = json.token;
                await AsyncStorage.setItem("@api_token", JSON.stringify(token));
                this.setState((prevState) => ({
                    status: 3,
                }));
            } catch (e) {
                console.error(e);
            }
        })();
    };

    onChangeAge = (age) => {
        this.setState((prevState) => ({
            age: age,
        }));
    };

    onChangeExp = (itemValue, itemIndex) => {
        this.setState(() => ({
            exp: itemValue,
        }));
    };

    render() {
        let view;
        if (this.state.status == 1) {
            view = <Loading></Loading>;
        } else if (this.state.status == 2) {
            view = (
                <DismissKeyboard>
                    <View style={styles.container}>
                        <View style={styles.block1}>
                            <Text>Введите ваш возраст:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeAge}
                                placeholder="возраст"
                                keyboardType="numeric"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        <View style={styles.block2}>
                            <Text>Вы когда-нибудь пробовали инвестировать?{this.exp}</Text>
                            <Picker selectedValue={this.state.exp} onValueChange={this.onChangeExp}>
                                <Picker.Item label="Нет, никогда не пробовал" value="0" />
                                <Picker.Item label="Нет, но хотел бы попробовать" value="1" />
                                <Picker.Item label="Да, но я ничего не понял" value="2" />
                                <Picker.Item label="У меня уже есть опыт" value="3" />
                            </Picker>
                        </View>
                        <Button
                            onPress={this.handleStart}
                            title="Начать"
                            color="#841584"
                            accessibilityLabel="Начать играть"
                        />
                        <StatusBar style="auto" />
                    </View>
                </DismissKeyboard>
            );
        } else {
            view = (
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                if (route.name === "News") {
                                    return (
                                        <SvgUri
                                            width="100%"
                                            height="100%"
                                            uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/debian.svg"
                                        />
                                    );
                                } else if (route.name === "Market") {
                                    return (
                                        <SvgUri
                                            width="100%"
                                            height="100%"
                                            uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/debian.svg"
                                        />
                                    );
                                }
                            },
                            tabBarInactiveTintColor: "gray",
                            tabBarActiveTintColor: "tomato",
                        })}
                    >
                        <Tab.Screen name="News" component={NewsScreen} />
                        <Tab.Screen name="Market" component={MarketScreen} />
                    </Tab.Navigator>
                </NavigationContainer>
            );
        }
        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    block1: {
        alignItems: "center",
        flexDirection: "row",
    },
});

export default App;
