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
import { Picker } from "@react-native-picker/picker";
import { getHeaderTitle } from "@react-navigation/elements";
import { Header } from "react-native-elements";

import Loading from "./components/loading";
import MarketScreen from "./components/market";
import NewsScreen from "./components/news";
import Balance from "./components/balance";

import Config from "./config.js";

import IconMarket from "./assets/market.svg";
import IconNews from "./assets/news.svg";
import { MainContext } from "./components/context";

const Tab = createBottomTabNavigator();

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: 1, exp: 0, api_token: 0, money: 0, companies: [] };
    }

    componentDidMount() {
        (async () => {
            try {
                const value = JSON.parse(await AsyncStorage.getItem("@api_token"));
                const money = JSON.parse(await AsyncStorage.getItem("@money"));
                if (value === null || money === null) {
                    this.setState({
                        status: 2,
                    });
                } else {
                    const response = await fetch(Config.host + "api/companies", {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + value,
                        },
                    });
                    if (response.status == 401)
                        this.setState({
                            status: 2,
                        });
                    else if (response.status != 200)
                        this.setState({
                            status: 1,
                        });
                    else {
                        const companies = await response.json();
                        this.setState({
                            status: 3,
                            api_token: value,
                            money: money,
                            companies: companies,
                        });
                    }
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
                const response = await fetch(Config.host + "api/register", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        age: this.state.age,
                        experience: this.state.exp,
                        blueprint: Math.random(),
                    }),
                });
                if (response.status != 200) return;
                const json = await response.json();
                await AsyncStorage.setItem("@api_token", JSON.stringify(json.token));
                await AsyncStorage.setItem("@money", JSON.stringify(0));
                this.setState((prevState) => ({
                    status: 3,
                    api_token: json.token,
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

    changeMoney = (value) => {
        this.setState((prev) => ({
            money: prev.money + value,
        }));
    };

    changeRates = (changes) => {
        let companies = this.state.companies;
        for (let i of changes) {
            for (let j of companies) {
                if (j.id == i.company_id) j.rate *= changes;
            }
        }
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
                <MainContext.Provider
                    value={{
                        api_token: this.state.api_token,
                        companies: this.state.companies,
                        money: this.state.money,
                        changeMoney: this.changeMoney,
                        changeRates: this.changeRates,
                    }}
                >
                    <NavigationContainer>
                        <Tab.Navigator
                            screenOptions={({ route }) => ({
                                tabBarIcon: () => {
                                    if (route.name === "news") {
                                        return <IconNews width="100%" height="100%" />;
                                    } else if (route.name === "market") {
                                        return <IconMarket width="100%" height="100%" />;
                                    }
                                },
                                tabBarInactiveTintColor: "gray",
                                tabBarActiveTintColor: "tomato",
                                header: ({ navigation, route, options }) => {
                                    const title = getHeaderTitle(options, route.name);
                                    return (
                                        <Header
                                            centerComponent={{
                                                text: title,
                                                style: { color: "#fff" },
                                            }}
                                            rightComponent={<Balance money={this.state.money} />}
                                        />
                                    );
                                },
                            })}
                        >
                            <Tab.Screen
                                name="news"
                                component={NewsScreen}
                                options={{ title: "Новости" }}
                            />
                            <Tab.Screen
                                name="market"
                                component={MarketScreen}
                                options={{ title: "Маркет" }}
                            />
                        </Tab.Navigator>
                    </NavigationContainer>
                </MainContext.Provider>
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
