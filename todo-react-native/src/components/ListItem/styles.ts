import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#262626",
        padding: 12,
        paddingRight: 8,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 8
    },
    textInput: {
        flex: 1,
        color: '#fff'
      },
    checkboxBase: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#4EA8DE",
        borderRadius: 50,
        alignContent: "center",
        justifyContent: "center"
    },
    checkboxChecked: {
        backgroundColor: "#5E60CE",
        borderColor: "#5E60CE"
    },
    taskUndone:{
        color: "#F2F2F2"
    },
    taskDone: {
        color: "#808080",
        textDecorationLine: "line-through"
    }
})