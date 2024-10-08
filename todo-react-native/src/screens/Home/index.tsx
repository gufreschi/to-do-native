import React, { useRef, useState, useEffect } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { styles } from "./styles";
import { ListItem } from "@/src/components/ListItem";
import { Empty } from "@/src/components/Empty";
import DraggableFlatList from 'react-native-draggable-flatlist';

export type Task = {
  description: string;
  completed: boolean;
  dueDate?: string;  // Opcional
  priority?: 'low' | 'medium' | 'high';
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const listItemRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de notificação não concedida');
      }
    };

    requestPermissions();
  }, []);

  async function scheduleNotification(dueDate: Date) {
    const oneDayBefore = new Date(dueDate).getTime() - 24 * 60 * 60 * 1000; // Notificação 1 dia antes

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Tarefa",
        body: `A tarefa "${taskDescription}" vence em 1 dia!`,
        data: { taskDescription },
      },
      trigger: {
        date: new Date(oneDayBefore),
      },
    });

    // Notificação quando a tarefa expira
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tarefa Expirada",
        body: `A tarefa "${taskDescription}" expirou!`, // Corrigido
        data: { taskDescription },
      },
      trigger: { date: dueDate },
    });
  }


  function handleTaskAdd() {
    if (!taskDescription) {
      return Alert.alert("Campo Vazio", "A tarefa precisa de uma descrição.");
    }

    if (!dueDate) {
      return Alert.alert("Data Faltando", "Por favor, selecione uma data para a tarefa.");
    }

    if (tasks.some(task => task.description === taskDescription)) {
      return Alert.alert("Tarefa Existe", "Já cadastrou essa tarefa.");
    }

    const newTask = {
      description: taskDescription,
      completed: false,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      priority: taskPriority,
    };

    setTasks(prevState => [...prevState, newTask]);
    scheduleNotification(dueDate);
    setTaskDescription('');
    setDueDate(undefined);
  }

  function handleTaskRemove(taskDescription: string) {
    Alert.alert("Remover", `Remover a tarefa ${taskDescription}?`, [
      {
        text: 'Sim',
        onPress: () => {
          const ref = listItemRefs.current[taskDescription];
          if (ref) {
            ref.bounceOut(500).then(() => {
              setTasks(prevState => prevState.filter(task => task.description !== taskDescription));
            });
          } else {
            setTasks(prevState => prevState.filter(task => task.description !== taskDescription));
          }
        }
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

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .sort((a, b) => {
      const priorityOrder = ['low', 'medium', 'high'];
      const priorityComparison = priorityOrder.indexOf(a.priority ?? 'low') - priorityOrder.indexOf(b.priority ?? 'low');

      if (priorityComparison !== 0) {
        return sortOrder === 'asc' ? priorityComparison : -priorityComparison;
      }

      return sortOrder === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    });

  return (
    <View style={styles.container}>
      <Image
        source={require('./../../assets/Logo.png')}
        style={styles.image}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Adicione uma nova tarefa"
          placeholderTextColor="#808080"
          onChangeText={setTaskDescription}
          value={taskDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleTaskAdd}>
          <Image
            source={require('./../../assets/plus.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Botão para escolher a data */}
      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: '#4EA8DE',
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {dueDate ? `Data: ${dueDate.toLocaleDateString()}` : "Escolher Data"}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Seletor de data */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      {/* Prioridade */}
      <View style={styles.priorityContainer}>
        <Text>Prioridade:</Text>
        <TouchableOpacity onPress={() => setTaskPriority('low')}>
          <Text style={taskPriority === 'low' ? styles.activePriority : styles.priority}>Baixa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTaskPriority('medium')}>
          <Text style={taskPriority === 'medium' ? styles.activePriority : styles.priority}>Média</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTaskPriority('high')}>
          <Text style={taskPriority === 'high' ? styles.activePriority : styles.priority}>Alta</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <Text>Filtrar:</Text>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={filter === 'all' ? styles.activeFilter : styles.filter}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('completed')}>
          <Text style={filter === 'completed' ? styles.activeFilter : styles.filter}>Concluídas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('pending')}>
          <Text style={filter === 'pending' ? styles.activeFilter : styles.filter}>Pendentes</Text>
        </TouchableOpacity>
      </View>

      {/* Ordenação */}
      <View style={styles.sortContainer}>
        <Text>Ordenar:</Text>
        <TouchableOpacity onPress={() => setSortOrder('asc')}>
          <Text style={sortOrder === 'asc' ? styles.activeSort : styles.sort}>Ascendente</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('desc')}>
          <Text style={sortOrder === 'desc' ? styles.activeSort : styles.sort}>Descendente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentBox}>
        <View style={styles.listContainer}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={[styles.textItems, { color: "#4EA8DE" }]}>Criadas</Text>
              <View style={styles.span}>
                <Text style={[styles.textItems, { color: "#fff" }]}>{tasks.length}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={[styles.textItems, { color: "#8284FA" }]}>Concluídas</Text>
              <View style={styles.span}>
                <Text style={[styles.textItems, { color: "#fff" }]}>{completedTasksCount}</Text>
              </View>
            </View>
          </View>

          <DraggableFlatList
            data={filteredTasks}
            keyExtractor={item => item.description}
            renderItem={({ item, drag }) => (
              <ListItem
                ref={(ref) => listItemRefs.current[item.description] = ref}
                task={item}
                onRemove={() => handleTaskRemove(item.description)}
                onToggle={() => handleTaskToggle(item.description)}
                onEdit={(newDescription) => handleTaskEdit(item.description, newDescription)}
                onLongPress={drag} // Passando o método drag como onLongPress
              />
            )}
            onDragEnd={({ data }) => setTasks(data)} // Atualiza a lista após arrastar
          />

        </View>
      </View>
    </View>
  );
}
