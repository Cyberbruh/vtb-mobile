import React from "react";
import { StyleSheet, Text, View } from "react-native";

class Balance extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.balance}>{Math.round(this.props.money * 100) / 100} ₽</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    balance: {
        color: "#fff",
    },
});

export default Balance;
