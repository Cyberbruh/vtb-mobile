import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
        let view;
        const companies = this.context.companies.map((company, index) => (
            <View key={index} style={styles.company}>
                <Text>{company.name}</Text>
            </View>
        ));
        view = (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {companies}
            </View>
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
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    company: {},
});

export default MarketScreen;
