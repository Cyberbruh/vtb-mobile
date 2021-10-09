import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainContext } from "./context";

const MarketStack = createNativeStackNavigator();

class CompanyComponent extends React.Component {
    static contextType = MainContext;
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>company</Text>
            </View>
        );
    }
}
class MarketComponent extends React.Component {
    static contextType = MainContext;
    componentDidMount() {}

    render() {
        console.log(this.context.companies);
        let view;
        const companies = this.context.companies.map((company, index) => (
            <View key={index} style={styles.company}>
                <Image style={styles.image} source={{ uri: company.image }} />
                <View style={styles.textblock}>
                    <Text style={styles.name}>{company.name}</Text>
                    <Text style={styles.rate}>Цена 1 акции: {company.rate} рублей</Text>
                </View>
            </View>
        ));
        view = (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>{companies}</ScrollView>
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
                <MarketStack.Screen name="MarketMain" component={MarketComponent} />
                <MarketStack.Screen name="CompanyPage" component={CompanyComponent} />
            </MarketStack.Navigator>
        );
    }
}

const styles = StyleSheet.create({
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
    textblock: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    name: {
        fontSize: 22,
    },
    rate: {
        fontSize: 15,
    },
});

export default MarketScreen;
