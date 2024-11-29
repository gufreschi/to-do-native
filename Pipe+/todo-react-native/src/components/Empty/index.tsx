import { View, Text, Image } from "react-native";
import { styles } from "./styles";

export function Empty(){
    return(
        <View style={styles.container}>
            <Image 
                source={require("@/src/assets/Clipboard.png")}
            />
            <View>
                <Text style={[styles.text, {fontWeight: "bold"}]}>Você ainda não tem tarefas cadastradas</Text>        
                <Text style={[styles.text, {fontWeight: "regular"}]}>Crie tarefas e organize seus itens a fazer</Text>        
            </View>
        </View>
    )
}