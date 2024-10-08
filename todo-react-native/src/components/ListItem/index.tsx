import React, { useState, forwardRef, Ref } from "react";
import { View, Text, Pressable, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { styles } from "./styles";
import { Task } from "@/src/screens/Home";

// Tipo de props para ListItem
type ListItemProps = {
  task: Task;
  onRemove: () => void;
  onToggle: () => void;
  onEdit: (newDescription: string) => void;
  onLongPress: () => void; // Adicionando a prop onLongPress
};

// Componente ListItem com forwardRef
export const ListItem = forwardRef<Animatable.View, ListItemProps>(({ task, onRemove, onToggle, onEdit, onLongPress }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);

  // Componente Checkbox
  function Checkbox({ onChange, checked }: { onChange: () => void, checked: boolean }) {
    return (
      <Pressable
        style={[styles.checkboxBase, checked && styles.checkboxChecked]}
        onPress={onChange}
      >
        {checked && <Ionicons name="checkmark" size={14} color="white" style={{ marginLeft: 2 }} />}
      </Pressable>
    );
  }


  function handleEditSubmit() {
    onEdit(newDescription);
    setIsEditing(false);
  }

  // Define a cor da borda com base na prioridade da tarefa
  const borderColor = () => {
    switch (task.priority) {
      case 'low':
        return '#B2E1D2'; // Verde suave
      case 'medium':
        return '#F0E68C'; // Amarelo suave
      case 'high':
        return '#F28B82'; // Vermelho suave
      default:
        return '#4EA8DE'; // Cor padrão para a borda
    }
  };

  return (
    <Animatable.View
      ref={ref}
      animation="fadeIn"
      duration={500}
      style={[styles.container, { borderColor: borderColor() }]}
    >
      <Checkbox onChange={onToggle} checked={task.completed} />
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={newDescription}
          onChangeText={setNewDescription}
          onBlur={handleEditSubmit}
          onSubmitEditing={handleEditSubmit}
        />
      ) : (
        <Pressable
          style={{ flex: 1 }}
          onPress={() => !task.completed && setIsEditing(true)}
          onLongPress={onLongPress} // Agora o onLongPress aciona o drag
        >
          <Text style={[styles.taskUndone, task.completed && styles.taskDone]}>
            {task.description}
          </Text>
          {task.dueDate && (
            <Text style={[styles.dateText, { color: '#B0C4DE' }]}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
            </Text>
          )}
        </Pressable>
      )}
      <TouchableOpacity
        onPress={() => {
          if (ref && typeof ref === 'object' && ref.current) {
            (ref.current as Animatable.View).bounceOut(500).then(() => onRemove());
          } else {
            onRemove();
          }
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#808080" style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    </Animatable.View>
  );
});