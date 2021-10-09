import React, { Children } from "react";
import { StyleSheet, Text, View } from "react-native";

class Balance extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.balance}>{this.props.money} рублей</Text>
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
