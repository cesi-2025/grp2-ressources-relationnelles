import React from "react";
import { View, StyleSheet, Text } from "react-native";
import theme from "@/src/theme";

function AuthLayout() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ressource Relationnel</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingTop: 56,
    },
    title: {
        paddingLeft: 20,
        paddingTop: 25,
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: 0.5,
        textAlign: "left",
    },
});

export default AuthLayout;
