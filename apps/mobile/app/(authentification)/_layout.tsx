import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import theme from "@/src/theme";

function AuthLayout() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home screen</Text>
            <Link href="/about" style={styles.button}>
                Go to About screen
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: theme.colors.background,
    },
    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: theme.colors.accent,
    },
});

export default AuthLayout;
