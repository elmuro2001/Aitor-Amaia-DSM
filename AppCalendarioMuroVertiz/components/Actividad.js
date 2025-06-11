import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Modal, StyleSheet, FlatList, Alert, Animated, Easing } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import styles from '../styles/CalendarioStyle';
import dimensiones from '../config/dimensiones';

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
  const [viewTask, setViewTask] = useState(null);
  const [viewTaskIndex, setViewTaskIndex] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isRange, setIsRange] = useState(false);
  const [taskhourEnd, setTaskHourEnd] = useState('');
  const [whichTime, setWhichTime] = useState('start');

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
    setTaskColor('');
    setTaskLocation('');
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
      hour: isRange && taskhourEnd ? `${taskhour} - ${taskhourEnd}` : taskhour,
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

    // Si es un rango, separar hora inicio y fin
    if (task.hour && task.hour.includes('-')) {
      const [start, end] = task.hour.split('-').map(s => s.trim());
      setTaskHour(start);
      setTaskHourEnd(end);
      setIsRange(true);
    } else {
      setTaskHour(task.hour || '');
      setTaskHourEnd('');
      setIsRange(false);
    }

    setTaskType(task.type || 'evento');
    setTaskDescription(task.description);
    setTaskColor(task.color);
    setTaskLocation(task.location);
    setEditIndex(index);
    setModalVisible(true);
  };

  // Mostrar modal de solo vista
  const openViewModal = (task, index) => {
    setViewTask(task);
    setViewTaskIndex(index);
    setViewModalVisible(true);
  };


  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Lista de eventos */}
      <View
        style={{
          height: ((dimensiones.dayHeight + 4) * 2),
          width: dimensiones.screenWidth - 120,
          marginRight: 10,
          marginLeft: 10,
          marginTop: -((dimensiones.dayHeight + 4) * 2),
          marginBottom: 0,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 8,
          overflow: 'hidden',
          elevation: 0,
        }}
      >
        <FlatList
          contentContainerStyle={{ paddingRight: 20 }}
          data={tasks[selectedDate] || []}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => openViewModal(item, index)}>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#d1d1d1',
                  padding: 10,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: item.color || '#333', fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>
                    {item.hour}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => startEditTask(index)} style={{ marginHorizontal: 8 }}>
                  <Ionicons name="pencil" size={22} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(index)}>
                  <Ionicons name="trash" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Botón principal y botones flotantes */}
      <TouchableOpacity style={styles.fab} onPress={toggleOptions}>
        <Ionicons name={showOptions ? 'close' : 'add'} size={30} color="#fff" />
      </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        {showOptions && (
          <>
            <Animated.View
              style={{
                transform: [{ translateY: animation.interpolate({ inputRange: [0, 15], outputRange: [0, -130] }) }],
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
          </>
        )}
      </View>

      {/* Modal de solo vista */}
      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Franja de color debajo del tipo */}
            {viewTask && viewTask.type && viewTask.color ? (
              <View
                style={{
                  width: '100%',
                  height: 24,
                  backgroundColor: viewTask.color || '#333',
                  borderRadius: 8,
                  marginBottom: 10,
                  marginTop: 4,
                }}
              />
            ) : null}
            {/* El resto del contenido del modal */}
            <View style={{ marginTop: 10, zIndex: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setViewModalVisible(false);
                    startEditTask(viewTaskIndex);
                  }}
                  style={{ marginHorizontal: 8 }}
                >
                  <Ionicons name="pencil" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setViewModalVisible(false);
                    deleteTask(viewTaskIndex);
                  }}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
              {viewTask && (
                <>
                  {viewTask.name ? (
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{viewTask.name}</Text>
                  ) : null}
                  {viewTask.hour ? (
                    <Text style={{ marginBottom: 10 }}>
                      {viewTask.hour}
                      {selectedDate
                        ? (() => {
                          const dateObj = new Date(selectedDate);
                          const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                          const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                          return ` ${dias[dateObj.getDay()]}, ${dateObj.getDate()} ${meses[dateObj.getMonth()]}`;
                        })()
                        : ''}
                    </Text>
                  ) : null}
                  {viewTask.description ? (
                    <View
                      style={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 10,
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: '#333' }}>{viewTask.description}</Text>
                    </View>
                  ) : null}
                  {viewTask.location ? (
                    <View
                      style={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 10,
                        marginTop: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="location-sharp" size={18} color="#6e6d6d" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#333' }}>{viewTask.location}</Text>
                    </View>
                  ) : null}
                </>
              )}
              <Button title="Cerrar" onPress={() => setViewModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de edición/creación */}
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
            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text>¿Rango?</Text>
                <TouchableOpacity
                  onPress={() => setIsRange(!isRange)}
                  style={{
                    marginLeft: 10,
                    backgroundColor: isRange ? '#2196F3' : '#ccc',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: '#fff' }}>{isRange ? 'Sí' : 'No'}</Text>
                </TouchableOpacity>
              </View>
              <Button
                title={taskhour ? `Hora inicio: ${taskhour}` : "Seleccionar hora inicio"}
                onPress={() => { setWhichTime('start'); setShowTimePicker(true); }}
              />
              {isRange && (
                <Button
                  title={taskhourEnd ? `Hora fin: ${taskhourEnd}` : "Seleccionar hora fin"}
                  onPress={() => { setWhichTime('end'); setShowTimePicker(true); }}
                />
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={
                    whichTime === 'start'
                      ? (taskhour ? new Date(`1970-01-01T${taskhour}:00`) : new Date())
                      : (taskhourEnd ? new Date(`1970-01-01T${taskhourEnd}:00`) : new Date())
                  }
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) {
                      const hours = selectedDate.getHours().toString().padStart(2, '0');
                      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                      if (whichTime === 'start') {
                        setTaskHour(`${hours}:${minutes}`);
                      } else {
                        setTaskHourEnd(`${hours}:${minutes}`);
                      }
                    }
                  }}
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

export default GestorActividades;