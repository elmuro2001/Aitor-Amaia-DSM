import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

import styles from '../styles/CalendarioStyle';
import SoloVista from '../modales/SoloVista';
import EdicionCreacion from '../modales/EdicionCreacion';
import ColorPicker from './ColorPicker';
import TaskList from './TaskList';
import useExternalEvents from '../hooks/useExternalEvents';
import { saveTaskUtil, deleteTaskUtil, startEditTaskUtil } from '../servicios/taskUtils';

//Componenete
const GestorActividades = ({ selectedDate, tasks, setTasks }) => {

  // Estados para las propiedades
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskhour, setTaskHour] = useState('');
  const [tasktype, setTaskType] = useState('evento'); // Por defecto "evento"
  const [taskdescription, setTaskDescription] = useState('');
  const [taskcolor, setTaskColor] = useState('#000000');
  const [tasklocation, setTaskLocation] = useState('');
  const [taskDone, setTaskDone] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
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
  // AsyncStorage.clear();

  // Carga inicial de eventos externos
  const externalEvents = useExternalEvents(selectedDate);

  useEffect(() => {
    if (modalVisible && !editTaskId && selectedDate) {
      setStartDate(new Date(selectedDate));
      setEndDate(new Date(selectedDate));
    }
  }, [modalVisible]);

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
    setEditTaskId(null);
    setTaskName('');
    setTaskHour('12:00');
    setTaskHourEnd('');
    setIsRange(false);
    setTaskType(type);
    setTaskDescription('');
    setTaskColor('#000000');
    setTaskLocation('');
    setTaskDone(false);

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
  const saveTask = () => saveTaskUtil({
    startDate,
    endDate,
    isRange,
    taskhour,
    taskhourEnd,
    editTaskId,
    tasks,
    setTasks,
    setModalVisible,
    setTaskName,
    setTaskHour,
    setTaskType,
    setTaskDescription,
    setTaskColor,
    setTaskLocation,
    setTaskDone,
    setError,
    taskName,
    tasktype,
    taskdescription,
    taskcolor,
    tasklocation,
    taskDone,
  });

  // Borrar tarea
  const deleteTask = (id, taskStartDate, taskEndDate) => deleteTaskUtil({
    id,
    startDate: new Date(taskStartDate),
    endDate: taskEndDate ? new Date(taskEndDate) : null,
    tasks,
    setTasks,
  });

  // Editar tarea
  const startEditTask = (task) => startEditTaskUtil({
    task,
    setTaskName,
    setTaskType,
    setTaskDescription,
    setTaskColor,
    setTaskLocation,
    setTaskDone,
    setEditTaskId,
    setModalVisible,
    setStartDate,
    setEndDate,
    setTaskHour,
    setTaskHourEnd,
    setIsRange,
  });

  // Mostrar modal de solo vista
  const openViewModal = (task) => {
    setViewTask(task);
    setEditTaskId(task.id);
    setViewModalVisible(true);
  };

  const allEvents = [
    ...(tasks[selectedDate] || []),
    ...externalEvents,
  ];

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Lista de eventos */}
      <TaskList
        tasks={tasks}
        externalEvents={externalEvents}
        selectedDate={selectedDate}
        setTasks={setTasks}
        openViewModal={openViewModal}
      />

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
      <SoloVista
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        viewTask={viewTask}
        tasks={tasks}
        selectedDate={selectedDate}
        startEditTask={startEditTask}
        deleteTask={deleteTask}
        setViewTask={setViewTask}
        styles={styles}
        isExternal={!!viewTask?.external}
      />

      {/* Modal de edición/creación */}
      <EdicionCreacion
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        editTaskId={editTaskId}
        tasktype={tasktype}
        setTaskType={setTaskType}
        taskName={taskName}
        setTaskName={setTaskName}
        taskhour={taskhour}
        setTaskHour={setTaskHour}
        isRange={isRange}
        setIsRange={setIsRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        datePickerMode={datePickerMode}
        setDatePickerMode={setDatePickerMode}
        showHourPicker={showHourPicker}
        setShowHourPicker={setShowHourPicker}
        hourPickerMode={hourPickerMode}
        setHourPickerMode={setHourPickerMode}
        taskhourEnd={taskhourEnd}
        setTaskHourEnd={setTaskHourEnd}
        taskDone={taskDone}
        setTaskDone={setTaskDone}
        taskdescription={taskdescription}
        setTaskDescription={setTaskDescription}
        taskcolor={taskcolor}
        setTaskColor={setTaskColor}
        tasklocation={tasklocation}
        setTaskLocation={setTaskLocation}
        saveTask={saveTask}
        error={error}
        ColorPicker={ColorPicker}
        styles={styles}
        isExternal={!!viewTask?.external}
        externalEventId={viewTask?.id}
        externalCalendarId={viewTask?.calendarId}
      />
    </View>
  );
};

export default GestorActividades;
