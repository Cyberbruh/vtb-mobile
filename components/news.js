import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
    Linking,
} from "react-native";
import Config from "../config.js";
import Loading from "./loading";
import { MainContext } from "./context";

class New extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>addwdawd...</Text>
            </View>
        );
    }
}

class NewsScreen extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = { status: 1, events: [], interval: null };
    }

    generateNew = () => {
        if (this.state.events.length > 0 && this.state.events.length % 7 == 0) {
            Alert.alert(
                "У вас отлично получается!",
                "Доверьте ваши финансы умным продуктам банка ВТБ, чтобы быть уверенным в их сохранности.",
                [
                    { text: "Перейти", onPress: () => Linking.openURL("https://www.vtb.ru/") },
                    { text: "Остаться" },
                ]
            );
        }
        (async () => {
            try {
                const response = await fetch(Config.host + "api/event/generate", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + this.context.api_token,
                    },
                });
                if (response.status != 200) return;
                const json = await response.json();
                this.setState((prevState) => ({
                    events: [json, ...prevState.events],
                    status: 2,
                }));
                setTimeout(this.context.changeRates, Config.time, json.changes);
                setTimeout(this.makeVisible, Config.time);
            } catch (e) {
                console.error(e);
            }
        })();
    };

    makeVisible = () => {
        let temp = this.state.events;
        for (let i of temp) i.visible = true;
        this.setState((prevState) => ({
            events: temp,
        }));
    };

    componentDidMount() {
        this.generateNew();
        this.interval = setInterval(this.generateNew, 2 * Config.time);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let view;
        if (this.state.status == 1) {
            view = <Loading></Loading>;
        } else if (this.state.status == 2) {
            const events = this.state.events.map((event, index) => (
                <View key={index} style={styles.event}>
                    <Image style={styles.image} source={{ uri: event.image }} />
                    <View style={styles.textblock}>
                        <Text style={styles.event_title}>{event.title}</Text>
                        <Text style={styles.event_text}>{event.text}</Text>
                        <Text style={styles.event_text}>{event.visible ? event.solution : ""}</Text>
                    </View>
                </View>
            ));
            view = (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.helper}>Новости будут появляться отсюда</Text>
                    <ScrollView style={styles.scrollView}>{events}</ScrollView>
                </SafeAreaView>
            );
        }
        return view;
    }
}

const styles = StyleSheet.create({
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
    event: {
        backgroundColor: "lightblue",
        borderRadius: 5,
        flexDirection: "row",
        padding: 10,
        marginTop: 20,
    },
    image: {
        borderRadius: 50,
        height: 65,
        width: 65,
        backgroundColor: "grey",
        margin: 10,
    },
    textblock: {
        flex: 1,
        marginLeft: 15,
    },
    event_title: {
        fontSize: 22,
    },
    event_text: {
        fontSize: 13,
        marginTop: 10,
    },
});

export default NewsScreen;
