import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, StyleSheet, FlatList, Alert, Animated, Switch, Easing } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/CalendarioStyle';


// Paleta de colores
const COLORS = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Gris', value: '#808080' },
  { name: 'Rojo', value: '#FF0000' },
  { name: 'Naranja', value: '#FFA500' },
  { name: 'Amarillo', value: '#FFFF00' },
  { name: 'Verde claro', value: '#90EE90' },
  { name: 'Verde oscuro', value: '#006400' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Azul', value: '#0000FF' },
  { name: 'Morado', value: '#800080' },
  { name: 'Fuxia', value: '#FF00FF' },
];

// Componente Picker de color
const ColorPicker = ({ selectedColor, onSelect }) => (
  <View style={styles.colorPickerContainer}>
    {COLORS.map((color) => (
      <TouchableOpacity
        key={color.value}
        style={[
          styles.colorCircle,
          { backgroundColor: color.value, borderColor: selectedColor === color.value ? '#333' : '#ccc' },
        ]}
        onPress={() => onSelect(color.value)}
      >
        {selectedColor === color.value && <View style={styles.selectedCircle} />}
      </TouchableOpacity>
    ))}
  </View>
);

//Componenete
const GestorActividades = ({ selectedDate, tasks, setTasks }) => {

  // Estados para las propiedades
  const [taskName, setTaskName] = useState('');
  const [taskhour, setTaskHour] = useState('');
  const [tasktype, setTaskType] = useState('evento'); // Por defecto "evento"
  const [taskdescription, setTaskDescription] = useState('');
  const [taskcolor, setTaskColor] = useState('#000000');
  const [tasklocation, setTaskLocation] = useState('');
  const [taskDone, setTaskDone] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // Animación para el botón de opciones
  const toggleOptions = () => {
    const toValue = showOptions ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();
    setShowOptions(!showOptions);
  };

  // Función para abrir el modal con la actividada específica
  const handleCreate = (type) => {
    setTaskName('');
    setTaskHour('12:00');
    setTaskType(type);
    setTaskDescription('');
    setTaskColor('#000000');
    setTaskLocation('');
    setTaskDone(false);
    setEditIndex(null);
    setModalVisible(true);
    toggleOptions(); // ocultar opciones otra vez
  };


  // Mostrar el selector de hora
  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setTaskHour(`${hours}:${minutes}`);
    }
  };

  // Crear o editar tarea con todas las propiedades
  const saveTask = async () => {
  if (!selectedDate) {
    setError('Selecciona una fecha antes de guardar la tarea.');
    return;
  }
  if (!taskName.trim()) {
    setError('El nombre de la tarea es obligatorio.');
    return;
  }
  setError('');
  const dateTasks = tasks[selectedDate] || [];
  const newTask = {
    name: taskName,
    hour: taskhour,
    type: tasktype,
    description: taskdescription,
    color: taskcolor || 'Negro',
    location: tasklocation,
    ...(tasktype === 'tarea' ? { done: taskDone } : {}),
  };
  let newDateTasks;
  if (editIndex !== null) {
    newDateTasks = [...dateTasks];
    newDateTasks[editIndex] = newTask;
  } else {
    newDateTasks = [...dateTasks, newTask];
  }
  const newTasks = { ...tasks, [selectedDate]: newDateTasks };
  setTasks(newTasks);

  //guardar
  await AsyncStorage.setItem('TASKS', JSON.stringify(newTasks));

  //reset al cerrar el modal tras guardar
  setTaskName('');
  setTaskHour('');
  setTaskType('evento');
  setTaskDescription('');
  setTaskColor('');
  setTaskLocation('');
  setTaskDone(false);
  setModalVisible(false);
  setEditIndex(null);
};

  // Borrar tarea
const deleteTask = async (index) => {
  const dateTasks = tasks[selectedDate] || [];
  const newDateTasks = dateTasks.filter((_, i) => i !== index);
  const newTasks = { ...tasks, [selectedDate]: newDateTasks };
  setTasks(newTasks);
  await AsyncStorage.setItem('TASKS', JSON.stringify(newTasks)); // <-- GUARDA EN ASYNCSTORAGE
};

  // Editar tarea
  const startEditTask = (index) => {
    const task = tasks[selectedDate][index];
    setTaskName(task.name);
    setTaskHour(task.hour);
    setTaskType(task.type || 'evento');
    setTaskDescription(task.description);
    setTaskColor(task.color);
    setTaskLocation(task.location);
    setTaskDone(task.done || false);
    setEditIndex(index);
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity style={styles.fab} onPress={toggleOptions}>
        <Ionicons name={showOptions ? 'close' : 'add'} size={30} color="#fff" />
      </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        {/* Botón para crear tarea */}
        {showOptions && (
          <Animated.View
            style={{
              transform: [
                {
                  translateY: animation.interpolate({ inputRange: [0, 15], outputRange: [0, -130],
                  }),
                },
              ],
              opacity: animation,
              marginBottom: 0,
            }}
          >
            <TouchableOpacity
              style={[styles.fabOption, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleCreate('tarea')}
            >
              <MaterialIcons name="assignment" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 5 }}>Tarea</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Botón para crear evento */}
        {showOptions && (
          <Animated.View
            style={{
              transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) }],
              opacity: animation,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.fabOption, { backgroundColor: '#2196F3' }]}
              onPress={() => handleCreate('evento')}
            >
              <MaterialIcons name="event" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 5 }}>Evento</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <FlatList
        data={tasks[selectedDate] || []}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', color: item.color || 'black' }}>{item.name}</Text>
              <Text>Hora: {item.hour} | Tipo: {item.type}</Text>
              <Text>Descripción: {item.description}</Text>
              <Text>Ubicación: {item.location}</Text>
            </View>
            <Button title="Editar" onPress={() => startEditTask(index)} />
            <Button title="Borrar" color="red" onPress={() => deleteTask(index)} />
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{editIndex !== null ? 'Editar' : 'Crear'} tarea para {selectedDate}</Text>
            {error ? (<Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>) : null}
            <TextInput
              placeholder="Nombre de la tarea"
              value={taskName}
              onChangeText={setTaskName}
              style={styles.input}
            />
            <View>
              <Text>Hora</Text>
              <Button title={taskhour ? `Hora: ${taskhour}` : "Seleccionar hora"} onPress={() => setShowTimePicker(true)} />
              {showTimePicker && (
                <DateTimePicker
                  value={taskhour ? new Date(`1970-01-01T${taskhour}:00`) : new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
                />
              )}
            </View>
            {/* Selector de tipo */}
            <View style={{ marginVertical: 10 }}>
              <Text>Tipo</Text>
              <Picker
                selectedValue={tasktype}
                onValueChange={(itemValue) => setTaskType(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Evento" value="evento" />
                <Picker.Item label="Tarea" value="tarea" />
              </Picker>
            </View> 
            {/* Mostrar el check solo si es tarea */}
            {tasktype === 'tarea' && editIndex !== null && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text>Hecha: </Text>
                <Switch value={taskDone} onValueChange={setTaskDone} />
              </View>
            )}
            <TextInput
              placeholder="Descripción"
              value={taskdescription}
              onChangeText={setTaskDescription}
              style={styles.input}
            />
            <Text>Color</Text>
            <ColorPicker selectedColor={taskcolor} onSelect={setTaskColor} />
            <TextInput
              placeholder="Ubicación"
              value={tasklocation}
              onChangeText={setTaskLocation}
              style={styles.input}
            />
            <Button title="Guardar" onPress={saveTask} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GestorActividades;