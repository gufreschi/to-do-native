import { View, Image, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { styles } from "./styles";
import { useState } from "react";
import { ListItem } from "@/src/components/ListItem";
import { Empty } from "@/src/components/Empty";

export type Task = {
  description: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDescription, setTaskDescription] = useState('');
  
  function handleTaskAdd(){
    if(tasks.some(task => task.description === taskDescription)){
      return Alert.alert("Tarefa Existe", "Já cadastrou essa tarefa");
    }

    setTasks(prevState => [...prevState, { description: taskDescription, completed: false }]);
    setTaskDescription('');
  }
  
  function handleTaskRemove(taskDescription: string){
    Alert.alert("Remover", `Remover a tarefa ${taskDescription}?`, [
        {
            text: 'Sim',
            onPress: () => setTasks(prevState => prevState.filter(task => task.description !== taskDescription))
        },
        {
            text: "Não",
            style: 'cancel'
        }
    ])
  }

  function handleTaskToggle(taskDescription: string) {
    setTasks(prevState => prevState.map(task => 
      task.description === taskDescription ? { ...task, completed: !task.completed } : task
    ));
  }

  function handleTaskEdit(oldDescription: string, newDescription: string) {
    setTasks(prevState => prevState.map(task =>
      task.description === oldDescription ? { ...task, description: newDescription } : task
    ));
  }

  const completedTasksCount = tasks.filter(task => task.completed).length;
  
  return (
    <View
      style={styles.container}
    >
      <Image 
        source={require('./../../assets/Logo.png')}
        style={styles.image}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Adicione uma nova tarefa"
          placeholderTextColor= "#808080"
          onChangeText={setTaskDescription}
          value={taskDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleTaskAdd}>
          <Image 
            source={require('./../../assets/plus.png')}
          />
        </TouchableOpacity>

      </View>
      <View style={styles.contentBox}>
        <View style={styles.listContainer}>
              <View style={styles.row}>
                  <View style={styles.col}>
                      <Text style={[styles.textItems, {color: "#4EA8DE"}]}>Criadas</Text>
                      <View style={styles.span}>
                          <Text style={[styles.textItems, {color: "#fff"}]}>{tasks.length}</Text>
                      </View>
                  </View>
                  <View style={styles.col}>
                      <Text style={[styles.textItems, {color: "#8284FA"}]}>Concluídas</Text>
                      <View style={styles.span}>
                          <Text style={[styles.textItems, {color: "#fff"}]}>{completedTasksCount}</Text>
                      </View>
                  </View>
              </View>
              <FlatList 
                    data={tasks}
                    keyExtractor={item => item.description}
                    renderItem={({item}) => (
                        <ListItem 
                            key={item.description}
                            task={item}
                            onRemove={() => handleTaskRemove(item.description)}
                            onToggle={() => handleTaskToggle(item.description)}
                            onEdit={(newDescription) => handleTaskEdit(item.description, newDescription)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                      <Empty />
                    )}

                />
          </View>
      </View>
    </View>
  );
}
