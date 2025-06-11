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
const GestorActividades = ({ selectedDate, tasks, setTasks }) => {
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
  const [startDate, setStartDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [endDate, setEndDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start'); // 'start' o 'end'
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [hourPickerMode, setHourPickerMode] = useState('start'); // 'start' o 'end'

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
    setTaskHourEnd('');
    setIsRange(false);
    setTaskType(type);
    setTaskDescription('');
    setTaskColor('');
    setTaskLocation('');
    setEditIndex(null);
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    setStartDate(baseDate);
    setEndDate(baseDate);
    setModalVisible(true);
    toggleOptions();
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
    if (!startDate) {
      setError('Selecciona una fecha antes de guardar la tarea.');
      return;
    }
    if (!taskName.trim()) {
      setError('El nombre de la tarea es obligatorio.');
      return;
    }
    setError('');
    const dateTasks = tasks[selectedDate] || [];

    // --- Lógica para fecha de fin por defecto ---
    let realEndDate = endDate;
    if (isRange && taskhour && taskhourEnd) {
      const [h1, m1] = taskhour.split(':').map(Number);
      const [h2, m2] = taskhourEnd.split(':').map(Number);
      if (h2 < h1 || (h2 === h1 && m2 <= m1)) {
        // Si la hora de fin es menor o igual que la de inicio, suma un día
        realEndDate = new Date(startDate);
        realEndDate.setDate(realEndDate.getDate() + 1);
      } else {
        // Si no, iguala endDate a startDate
        realEndDate = startDate;
      }
    } else if (isRange) {
      // Si el usuario no ha tocado nada, endDate debe ser igual a startDate
      realEndDate = startDate;
    } else {
      realEndDate = null;
    }

    const newTask = {
      name: taskName,
      type: tasktype,
      description: taskdescription,
      color: taskcolor || 'negro',
      location: tasklocation,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: isRange ? (realEndDate ? realEndDate.toISOString() : null) : null,
      startHour: taskhour,
      endHour: isRange ? taskhourEnd : null,
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
    setStartDate(task.startDate ? new Date(task.startDate) : new Date());
    setEndDate(task.endDate ? new Date(task.endDate) : new Date());
    setTaskHour(task.startHour || '');
    setTaskHourEnd(task.endHour || '');
    setIsRange(!!task.endHour);
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
                  {item.type === 'evento' && item.startDate && item.startHour && (
                    <Text style={{ color: '#666', fontSize: 14 }}>
                      {(() => {
                        const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                        const startD = new Date(item.startDate);
                        const endD = item.endDate ? new Date(item.endDate) : null;
                        const sameDay = endD && startD.toDateString() === endD.toDateString();

                        if (item.endHour && endD) {
                          if (sameDay) {
                            return `${item.startHour} - ${item.endHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                          } else {
                            return `${item.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]} - ${item.endHour} ${dias[endD.getDay()]}, ${endD.getDate()} ${meses[endD.getMonth()]}`;
                          }
                        } else {
                          return `${item.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                        }
                      })()}
                    </Text>
                  )}
                </View>
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
                  {viewTask.type === 'evento' && viewTask.startDate && viewTask.startHour && (
                    <Text style={{ marginBottom: 10 }}>
                      {(() => {
                        const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                        const startD = new Date(viewTask.startDate);
                        const endD = viewTask.endDate ? new Date(viewTask.endDate) : null;
                        const sameDay = endD && startD.toDateString() === endD.toDateString();

                        if (viewTask.endHour && endD) {
                          if (sameDay) {
                            // Mismo día: 12:00 - 13:00 mié, 11 jun
                            return `${viewTask.startHour} - ${viewTask.endHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                          } else {
                            // Distinto día: 12:00 mié, 11 jun - 13:00 jue, 12 jun
                            return `${viewTask.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]} - ${viewTask.endHour} ${dias[endD.getDay()]}, ${endD.getDate()} ${meses[endD.getMonth()]}`;
                          }
                        } else {
                          // Solo una hora: 12:00 mié, 11 jun
                          return `${viewTask.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                        }
                      })()}
                    </Text>
                  )}
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

            {tasktype === 'evento' && (
              <View style={{ marginBottom: 10 }}>
                {/* Hora y Rango de horas */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                  <Text>Hora</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontStyle: 'italic', color: '#888', marginRight: 8 }}>Rango de horas</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (!isRange) {
                          setEndDate(startDate);
                          if (taskhour) {
                            // Suma 1 hora a la hora de inicio actual
                            const [h, m] = taskhour.split(':').map(Number);
                            const endHour = (h + 1) % 24;
                            const endStr = `${endHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                            setTaskHourEnd(endStr);
                          } else {
                            setTaskHourEnd('13:00');
                          }
                        }
                        setIsRange(!isRange);
                      }}
                      style={{
                        width: 22,
                        height: 22,
                        borderWidth: 2,
                        borderColor: '#2196F3',
                        borderRadius: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isRange ? '#2196F3' : '#fff',
                      }}
                    >
                      {isRange && (
                        <View style={{
                          width: 14,
                          height: 14,
                          backgroundColor: '#fff',
                          borderRadius: 2,
                        }} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Si NO es rango, solo muestra una fila con fecha y hora */}
                {!isRange && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 10, minWidth: 110, alignItems: 'center'
                      }}
                      onPress={() => { setDatePickerMode('start'); setShowDatePicker(true); }}
                    >
                      <Text>
                        {startDate
                          ? (() => {
                            const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                            const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                            return `${dias[startDate.getDay()]}, ${startDate.getDate()} ${meses[startDate.getMonth()]}`;
                          })()
                          : 'Fecha'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, minWidth: 70, alignItems: 'center'
                      }}
                      onPress={() => { setHourPickerMode('start'); setShowHourPicker(true); }}
                    >
                      <Text>{taskhour || 'Hora'}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Si es rango, muestra Desde y Hasta */}
                {isRange && (
                  <>
                    <Text style={{ fontStyle: 'italic', color: '#888', marginLeft: 5 }}>Desde</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 10, minWidth: 110, alignItems: 'center'
                        }}
                        onPress={() => { setDatePickerMode('start'); setShowDatePicker(true); }}
                      >
                        <Text>
                          {startDate
                            ? (() => {
                              const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                              const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                              return `${dias[startDate.getDay()]}, ${startDate.getDate()} ${meses[startDate.getMonth()]}`;
                            })()
                            : 'Fecha'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, minWidth: 70, alignItems: 'center'
                        }}
                        onPress={() => { setHourPickerMode('start'); setShowHourPicker(true); }}
                      >
                        <Text>{taskhour || 'Hora'}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontStyle: 'italic', color: '#888', marginLeft: 5 }}>Hasta</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 10, minWidth: 110, alignItems: 'center'
                        }}
                        onPress={() => { setDatePickerMode('end'); setShowDatePicker(true); }}
                      >
                        <Text>
                          {endDate
                            ? (() => {
                              const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                              const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                              return `${dias[endDate.getDay()]}, ${endDate.getDate()} ${meses[endDate.getMonth()]}`;
                            })()
                            : 'Fecha'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, minWidth: 70, alignItems: 'center'
                        }}
                        onPress={() => { setHourPickerMode('end'); setShowHourPicker(true); }}
                      >
                        <Text>{taskhourEnd || 'Hora'}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* DateTimePickers */}
                {showDatePicker && (
                  <DateTimePicker
                    value={datePickerMode === 'start' ? startDate : endDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        if (datePickerMode === 'start') setStartDate(selectedDate);
                        else setEndDate(selectedDate);
                      }
                    }}
                  />
                )}
                {showHourPicker && (
                  <DateTimePicker
                    value={
                      hourPickerMode === 'start'
                        ? (taskhour ? new Date(startDate.toDateString() + ' ' + taskhour) : startDate)
                        : (taskhourEnd ? new Date(endDate.toDateString() + ' ' + taskhourEnd) : endDate)
                    }
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowHourPicker(false);
                      if (selectedDate) {
                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                        if (hourPickerMode === 'start') {
                          setTaskHour(`${hours}:${minutes}`);
                        } else {
                          setTaskHourEnd(`${hours}:${minutes}`);
                          // Comprobar si la hora de fin es menor o igual que la de inicio
                          if (taskhour) {
                            const [h1, m1] = taskhour.split(':').map(Number);
                            const [h2, m2] = [parseInt(hours), parseInt(minutes)];
                            // Si la hora de fin es menor o igual que la de inicio, suma un día a endDate
                            if (h2 < h1 || (h2 === h1 && m2 <= m1)) {
                              const newEndDate = new Date(startDate);
                              newEndDate.setDate(newEndDate.getDate() + 1);
                              setEndDate(newEndDate);
                            } else {
                              // Si no, iguala endDate a startDate
                              setEndDate(startDate);
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </View>
            )}

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