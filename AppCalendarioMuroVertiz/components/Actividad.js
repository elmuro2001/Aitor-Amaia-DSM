import React, { useState } from 'react';
import { View, Text,TouchableOpacity, TextInput, Button, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
const GestorActividades = ({ selectedDate }) => {
  const [tasks, setTasks] = useState({});
  const [taskName, setTaskName] = useState('');
  const [taskhour, setTaskHour] = useState('');
  const [tasktype, setTaskType] = useState('evento'); // Por defecto "evento"
  const [taskdescription, setTaskDescription] = useState('');
  const [taskcolor, setTaskColor] = useState('');
  const [tasklocation, setTaskLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [error, setError] = useState('');

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
  const saveTask = () => {
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
      color: taskcolor || 'negro',
      location: tasklocation,
    };
    let newDateTasks;
    if (editIndex !== null) {
      newDateTasks = [...dateTasks];
      newDateTasks[editIndex] = newTask;
    } else {
      newDateTasks = [...dateTasks, newTask];
    }
    setTasks({ ...tasks, [selectedDate]: newDateTasks });
    setTaskName('');
    setTaskHour('');
    setTaskType('evento');
    setTaskDescription('');
    setTaskColor('');
    setTaskLocation('');
    setModalVisible(false);
    setEditIndex(null);
  };

  // Borrar tarea
  const deleteTask = (index) => {
    const dateTasks = tasks[selectedDate] || [];
    const newDateTasks = dateTasks.filter((_, i) => i !== index);
    setTasks({ ...tasks, [selectedDate]: newDateTasks });
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
    setEditIndex(index);
    setModalVisible(true);
  };

  return (
    <View>
      <Text>Fecha seleccionada: {selectedDate || 'Ninguna'}</Text>
      <Button title="Crear Tarea" onPress={() => {
        setTaskName('');
        setTaskHour('00:00');
        setTaskType('evento');
        setTaskDescription('');
        setTaskColor('');
        setTaskLocation('');
        setEditIndex(null);
        setModalVisible(true);
      }} />
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5
  },
    colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    opacity: 0.5,
  },
});

export default GestorActividades;