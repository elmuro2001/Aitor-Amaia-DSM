import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';
import { createCalendarEvent, getAllCalendarIds } from './calendar_connection';

// Guardar o editar tarea
export const saveTaskUtil = async ({
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
}) => {
  if (!startDate) {
    setError('Selecciona una fecha antes de guardar la tarea.');
    return;
  }
  if (!taskName.trim()) {
    setError('El nombre de la tarea es obligatorio.');
    return;
  }
  setError('');
  const keyDate = startDate ? startDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  let newTasks = { ...tasks };

  // Lógica para fecha de fin por defecto
  let realEndDate = endDate;
  if (isRange && taskhour && taskhourEnd) {
    const [h1, m1] = taskhour.split(':').map(Number);
    const [h2, m2] = taskhourEnd.split(':').map(Number);
    // Si el usuario NO ha cambiado la fecha de fin manualmente (es igual a la de inicio)
    if (endDate && startDate && endDate.toDateString() === startDate.toDateString()) {
      if (h2 < h1 || (h2 === h1 && m2 <= m1)) {
        // Si la hora de fin es menor o igual, suma un día
        realEndDate = new Date(startDate);
        realEndDate.setDate(realEndDate.getDate() + 1);
      } else {
        realEndDate = startDate;
      }
    }
  } else if (isRange) {
    realEndDate = startDate;
  } else {
    realEndDate = null;
  }

  let externalEventId = null;
  let externalCalendarId = null;
  if (tasktype === 'evento' && !editTaskId) {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      // Busca el primer calendario visible y editable
      const editableCalendar = calendars.find(
        cal => cal.allowsModifications && cal.accessLevel === 'owner' && cal.isVisible
      );
      if (!editableCalendar) {
        setError('No se encontró un calendario visible y editable para guardar el evento.');
        return;
      }
      const calendarId = editableCalendar.id;
      externalEventId = await createCalendarEvent(calendarId, {
        title: taskName,
        startDate,
        endDate: isRange ? realEndDate : startDate,
        notes: taskdescription,
        location: tasklocation,
      });
      externalCalendarId = calendarId;
      console.log('Evento creado en calendario visible:', {
        externalEventId,
        externalCalendarId,
        title: taskName,
        startDate,
        endDate: isRange ? realEndDate : startDate,
        notes: taskdescription,
        location: tasklocation,
      });
    } catch (e) {
      setError('Error creando el evento en el calendario local.');
      console.log('Error creando evento externo:', e);
      return;
    }
  }

  const newTask = {
    id: editTaskId || Date.now().toString() + Math.random().toString(36).slice(2, 11),
    name: taskName,
    type: tasktype,
    description: taskdescription,
    color: taskcolor || 'Negro',
    location: tasklocation,
    done: taskDone,
    startDate: startDate ? startDate.toISOString() : null,
    endDate: isRange ? (realEndDate ? realEndDate.toISOString() : null) : null,
    startHour: taskhour,
    endHour: isRange ? taskhourEnd : null,
    externalEventId,
    externalCalendarId,
  };

  // Si estamos editando y la fecha ha cambiado, elimina la tarea original del día anterior
  if (editTaskId) {
    let originalDate = null;
    let originalIdx = null;
    for (const [date, arr] of Object.entries(tasks)) {
      const idx = arr.findIndex(t => t.id === editTaskId);
      if (idx !== -1) {
        originalDate = date;
        originalIdx = idx;
        break;
      }
    }
    if (originalDate && originalDate !== keyDate) {
      // Elimina la tarea del día original por id
      const oldTasks = [...(tasks[originalDate] || [])];
      oldTasks.splice(originalIdx, 1);
      newTasks[originalDate] = oldTasks;
    }
  }

  const dayTasks = newTasks[keyDate] ? [...newTasks[keyDate]] : [];
  const idx = dayTasks.findIndex(t => t.id === newTask.id);
  if (idx !== -1) {
    dayTasks[idx] = newTask;
  } else {
    dayTasks.push(newTask);
  }
  newTasks[keyDate] = dayTasks;

  setTasks(newTasks);
  await AsyncStorage.setItem('TASKS', JSON.stringify(newTasks));

  // Reset al cerrar el modal tras guardar
  setTaskName('');
  setTaskHour('');
  setTaskType('evento');
  setTaskDescription('');
  setTaskColor('');
  setTaskLocation('');
  setTaskDone(false);
  setModalVisible(false);
};

// Borrar tarea
export const deleteTaskUtil = async ({
  id,
  startDate,
  endDate,
  tasks,
  setTasks,
}) => {
  let newTasks = { ...tasks };

  if (endDate) {
    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    const last = new Date(endDate);
    last.setHours(0, 0, 0, 0);

    while (current <= last) {
      const key = current.getFullYear() + '-' +
        String(current.getMonth() + 1).padStart(2, '0') + '-' +
        String(current.getDate()).padStart(2, '0');
      const dayTasks = newTasks[key] ? [...newTasks[key]] : [];
      const newDateTasks = dayTasks.filter((t) => t.id !== id);
      newTasks[key] = newDateTasks;
      current.setDate(current.getDate() + 1);
    }
  } else {
    const keyDate = startDate ? startDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const dateTasks = newTasks[keyDate] || [];
    const newDateTasks = dateTasks.filter((t) => t.id !== id);
    newTasks[keyDate] = newDateTasks;
  }

  setTasks(newTasks);
  await AsyncStorage.setItem('TASKS', JSON.stringify(newTasks));
};

// Editar tarea (solo setea los estados, no hace falta async)
export const startEditTaskUtil = ({
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
}) => {
  setTaskName(task.name);
  setTaskType(task.type || 'evento');
  setTaskDescription(task.description);
  setTaskColor(task.color);
  setTaskLocation(task.location);
  setTaskDone(task.done || false);
  setEditTaskId(task.id);
  setModalVisible(true);
  setStartDate(task.startDate ? new Date(task.startDate) : new Date());
  setEndDate(task.endDate ? new Date(task.endDate) : new Date());

  // Si es un rango, separar hora inicio y fin
  if (task.hour && task.hour.includes('-')) {
    const [start, end] = task.hour.split('-').map(s => s.trim());
    setTaskHour(start);
    setTaskHourEnd(end);
    setIsRange(true);
  } else {
    setTaskHour(task.startHour || task.hour || '');
    setTaskHourEnd(task.endHour || '');
    setIsRange(!!task.endHour);
  }
};