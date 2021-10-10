import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            exp: 0,
            api_token: 0,
            money: 0,
            companies: [],
            key: Math.random(),
        };
    }

    componentDidMount() {
        (async () => {
            try {
                //await AsyncStorage.removeItem("@mem");
                const jsonValue = await AsyncStorage.getItem("@mem");
                if (jsonValue === null) {
                    this.setState({
                        status: 2,
                    });
                } else {
                    let value = JSON.parse(jsonValue);
                    const response = await fetch(Config.host + "api/companies", {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + value.api_token,
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
                        let companies = await response.json();
                        for (let i of companies) {
                            i.stock = 0;
                        }
                        for (let i of companies) {
                            if (value.companies) {
                                for (let j of value.companies) {
                                    if (i.id == j.id) i.stock = j.stock;
                                }
                            }
                        }
                        this.setState({
                            status: 3,
                            api_token: value.api_token,
                            money: value.money,
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
        if (this.state.age <= 0 || this.state.age > 150) {
            Alert.alert("Неверный возраст", "Введите, пожалуйста, реальный возраст", [
                { text: "OK" },
            ]);
            return;
        }
        (async () => {
            try {
                this.setState(() => ({
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
                await AsyncStorage.setItem(
                    "@mem",
                    JSON.stringify({
                        api_token: json.token,
                        money: 3500,
                    })
                );
                Alert.alert(
                    "Обучение",
                    "Вам предоставлен стартовый капитал 3500р. На странице новостей вы можете увидеть происходящие в мире события, они появляются каждые 13 секунд, после появления события у вас есть 13 секунд до обновления курса акций, вы должны предугадать куда сдвинется курс и у каких компаний. Рекомендуем сначала изучить компании. Независимо от новостей у всех компаний немного меняется курс.",
                    [{ text: "OK" }]
                );
                this.componentDidMount();
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

    changeStock = (id, count) => {
        let temp = this.state.companies,
            money = this.state.money;
        for (let i of temp)
            if (i.id == id) {
                i.stock = parseInt(i.stock) + parseInt(count);
                money -= parseFloat(i.rate) * parseInt(count);
            }
        this.setState(() => ({
            companies: temp,
            money: money,
            key: Math.random(),
        }));
        (async () => {
            try {
                await AsyncStorage.setItem(
                    "@mem",
                    JSON.stringify({
                        api_token: this.state.api_token,
                        money: this.state.money,
                        companies: this.state.companies,
                    })
                );
            } catch (e) {
                console.error(e);
            }
        })();
    };

    changeRates = (changes) => {
        let companies = this.state.companies;
        for (let i of changes) {
            for (let j of companies) {
                if (j.id == i.company_id) j.rate *= i.change;
            }
        }
        for (let i of companies) {
            i.rate *= 0.975 + 0.1 * Math.random();
        }
        this.setState(() => ({
            companies: companies,
            key: Math.random(),
        }));
    };

    render() {
        let view;
        if (this.state.status == 1) {
            view = <Loading></Loading>;
        } else if (this.state.status == 2) {
            view = (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.container}>
                        <View style={styles.blockAge}>
                            <Text>Введите ваш возраст:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeAge}
                                placeholder="возраст"
                                keyboardType="numeric"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        <View style={styles.blockPicker}>
                            <Text style={styles.pickerText}>
                                Вы когда-нибудь пробовали инвестировать?{this.exp}
                            </Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={this.state.exp}
                                onValueChange={this.onChangeExp}
                            >
                                <Picker.Item label="Нет, никогда не пробовал" value="0" />
                                <Picker.Item label="Есть минимальный опыт" value="1" />
                                <Picker.Item label="У меня большой опыт" value="2" />
                            </Picker>
                        </View>
                        <Button
                            onPress={this.handleStart}
                            title="Начать"
                            color="#3A83F1"
                            accessibilityLabel="Начать играть"
                        />
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            view = (
                <MainContext.Provider
                    value={{
                        api_token: this.state.api_token,
                        companies: this.state.companies,
                        money: this.state.money,
                        changeStock: this.changeStock,
                        changeRates: this.changeRates,
                        key: this.state.key,
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
    picker: {
        marginVertical: 20,
    },
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
    blockAge: {
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 20,
    },
    blockPicker: {
        marginVertical: 20,
    },
});

export default App;
