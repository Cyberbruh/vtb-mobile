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
    TextInput,
    Keyboard,
    Alert,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainContext } from "./context";

const MarketStack = createNativeStackNavigator();

class CompanyComponent extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = { company: this.props.route.params.company, stockCount: 0 };
    }

    checkStockBuy = () => {
        if (
            this.state.stockCount * this.state.company.rate > this.context.money ||
            this.state.stockCount == 0
        ) {
            Alert.alert("У вас не хватает денег!", "Проверьте правильность ввода", [
                { text: "OK" },
            ]);
            return;
        }
        this.setState(() => ({
            stockCount: 0,
        }));
        this.context.changeStock(this.state.company.id, this.state.stockCount);
    };

    checkStockSell = () => {
        if (this.state.stockCount > this.state.company.stock || this.state.stockCount == 0) {
            Alert.alert("У вас не хватает акций!", "Проверьте правильность ввода", [
                { text: "OK" },
            ]);
            return;
        }
        this.setState(() => ({
            stockCount: 0,
        }));
        this.context.changeStock(this.state.company.id, -this.state.stockCount);
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
                        <TextInput
                            style={companyStyles.input}
                            value={this.state.stockCount.toString()}
                            onChangeText={this.onChangeStock}
                            placeholder="количество"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={companyStyles.buttons}>
                        <Button
                            style={companyStyles.button}
                            onPress={this.checkStockBuy}
                            title="Купить"
                            color="#841584"
                        />
                        <Button
                            style={companyStyles.button}
                            onPress={this.checkStockSell}
                            title="Продать"
                            color="#841584"
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
        //backgroundColor: "black",
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-between",
        marginBottom: 20,
    },
    wrapper: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        //backgroundColor: "black",
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
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollView: {},
    company: {
        flexDirection: "row",
        backgroundColor: "lightblue",
        borderRadius: 10,
        marginTop: 10,
    },
    image: {
        borderRadius: 50,
        height: 65,
        width: 65,
        backgroundColor: "grey",
        margin: 15,
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
        paddingHorizontal: 15,
    },
    name: {
        fontSize: 22,
    },
    rate: {
        fontSize: 20,
    },
});

export default MarketScreen;
