import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const MarketStack = createNativeStackNavigator();

class CompanyComponent extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>company</Text>
            </View>
        );
    }
}
class MarketComponent extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>market</Text>
            </View>
        );
    }
}

class MarketScreen extends React.Component {
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
});

export default MarketScreen;
