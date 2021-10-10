import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Slider } from "react-native-elements";
import { MainContext } from "./context";

const MarketStack = createNativeStackNavigator();

class CompanyComponent extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = { company: this.props.route.params.company, stockCount: 0 };
    }

    checkStock = () => {
        if (this.state.stockCount == 0) {
            Alert.alert("Выбрано 0 акций!", "Нужно хоть сколько-то", [{ text: "OK" }]);
            return;
        }
        if (this.state.stockCount < 0) {
            if (this.state.stockCount > this.state.company.stock) {
                Alert.alert("У вас не хватает акций!", "Проверьте правильность ввода", [
                    { text: "OK" },
                ]);
                return;
            }
        } else {
            if (this.state.stockCount * this.state.company.rate > this.context.money) {
                Alert.alert("У вас не хватает денег!", "Проверьте правильность ввода", [
                    { text: "OK" },
                ]);
                return;
            }
        }
        this.setState(() => ({
            stockCount: 0,
            key: Math.random(),
        }));
        this.context.changeStock(this.state.company.id, this.state.stockCount);
    };

    onChangeStock = (count) => {
        this.setState(() => ({
            stockCount: count,
        }));
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={companyStyles.container}>
                    <View style={companyStyles.wrapper}>
                        <Image
                            style={companyStyles.image}
                            source={{ uri: this.state.company.image }}
                        />
                        <Text style={companyStyles.name}>{this.state.company.name}</Text>
                        <Text style={companyStyles.description}>
                            {this.state.company.description}
                        </Text>
                        <Text style={companyStyles.rate}>
                            {Math.round(this.state.company.rate * 100) / 100} ₽ за одну акцию
                        </Text>
                        <Text style={companyStyles.have}>
                            У вас акций: {this.state.company.stock}
                        </Text>
                    </View>
                    <View style={companyStyles.inputView}>
                        <Text style={companyStyles.inputLabel}>
                            Введите количество акций для продажи/покупки
                        </Text>
                        <Slider
                            key={this.context.key}
                            style={companyStyles.slider}
                            value={this.state.stockCount}
                            onValueChange={this.onChangeStock}
                            maximumValue={Math.round(this.context.money / this.state.company.rate)}
                            minimumValue={-this.state.company.stock}
                            step={1}
                            trackStyle={{
                                height: 10,
                                backgroundColor: "transparent",
                            }}
                            thumbStyle={{ height: 25, width: 25, backgroundColor: "#3A83F1" }}
                        />
                        <Text style={companyStyles.inputLabel}>
                            {this.state.stockCount >= 0 ? "Купить " : "Продать "}
                            {Math.abs(this.state.stockCount)} акций
                        </Text>
                    </View>
                    <View style={companyStyles.buttons}>
                        <Button
                            style={companyStyles.button}
                            onPress={this.checkStock}
                            title="Провести сделку"
                            color="#3A83F1"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
class MarketComponent extends React.Component {
    static contextType = MainContext;
    render() {
        let view;
        const companies = this.context.companies.map((company, index) => (
            <TouchableOpacity
                key={index}
                style={marketStyles.company}
                onPress={() => this.props.navigation.navigate("companypage", { company: company })}
            >
                <Image style={marketStyles.image} source={{ uri: company.image }} />
                <View style={marketStyles.rightblock}>
                    <View style={marketStyles.textblock}>
                        <Text style={marketStyles.name}>{company.name}</Text>
                        <Text style={marketStyles.rate}>
                            {Math.round(company.rate * 100) / 100} ₽
                        </Text>
                    </View>
                    {company.stock > 0 && (
                        <Text style={marketStyles.have}>У вас {company.stock} акции</Text>
                    )}
                </View>
            </TouchableOpacity>
        ));
        view = (
            <SafeAreaView style={marketStyles.container}>
                <Text style={marketStyles.helper}>Чтобы купить акции компании, нажмите на неё</Text>
                <ScrollView style={marketStyles.scrollView}>{companies}</ScrollView>
            </SafeAreaView>
        );
        return view;
    }
}

class MarketScreen extends React.Component {
    static contextType = MainContext;
    render() {
        return (
            <MarketStack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <MarketStack.Screen name="marketmain" component={MarketComponent} />
                <MarketStack.Screen name="companypage" component={CompanyComponent} />
            </MarketStack.Navigator>
        );
    }
}

const companyStyles = StyleSheet.create({
    inputView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    slider: {
        width: "75%",
        marginTop: 20,
    },
    buttons: {
        flexDirection: "row",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    wrapper: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    image: {
        borderRadius: 50,
        height: 65,
        width: 65,
        backgroundColor: "grey",
        margin: 15,
    },
    name: {
        fontSize: 25,
    },
    description: {
        fontSize: 15,
        marginTop: 15,
    },
    rate: {
        fontSize: 22,
        marginTop: 20,
    },
    have: {
        fontSize: 22,
        marginTop: 15,
    },
});

const marketStyles = StyleSheet.create({
    helper: {
        textAlign: "center",
        color: "grey",
    },
    container: {
        flex: 1,
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    company: {
        flexDirection: "row",
        backgroundColor: "#A5D5FF",
        borderRadius: 7,
        marginTop: 10,
    },
    image: {
        borderRadius: 50,
        height: 65,
        width: 65,
        backgroundColor: "#3A83F1",
        margin: 12,
    },
    rightblock: {
        flexDirection: "column",
        flex: 1,
    },
    have: {
        fontSize: 12,
        marginTop: -25,
        width: "100%",
        textAlign: "center",
        marginBottom: 10,
    },
    textblock: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        height: "100%",
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 18,
    },
    rate: {
        fontSize: 18,
    },
});

export default MarketScreen;
