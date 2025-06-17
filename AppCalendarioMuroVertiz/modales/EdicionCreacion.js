
import React from 'react';
import * as Calendar from 'expo-calendar';
import { Modal, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import AsignacionActividadWorkplaceModal from './AsignacionActvididad-Workplace';

const EdicionCreacion = ({
    modalVisible,
    setModalVisible,
    editTaskId,
    tasktype,
    setTaskType,
    taskName,
    setTaskName,
    taskhour,
    setTaskHour,
    isRange,
    setIsRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showDatePicker,
    setShowDatePicker,
    datePickerMode,
    setDatePickerMode,
    showHourPicker,
    setShowHourPicker,
    hourPickerMode,
    setHourPickerMode,
    taskhourEnd,
    setTaskHourEnd,
    taskDone,
    setTaskDone,
    taskworkplace,
    setTaskWorkplace,
    taskdescription,
    setTaskDescription,
    taskcolor,
    setTaskColor,
    tasklocation,
    setTaskLocation,
    saveTask,
    error,
    ColorPicker,
    styles,
    isExternal,
    externalEventId,
    externalCalendarId,
    setRefreshExternalEvents,
    setRefreshWorkplaces,
}) => {
    const [asignacionmodalvisible, setasignacionmodalvisible] = useState(false);
    const [workplaceName, setWorkplaceName] = useState('Seleccionar');
    const [workplaceColor, setWorkplaceColor] = useState('#000');

  
    const handleSave = async () => {
        if (isExternal && externalEventId && externalCalendarId) {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                alert('Permiso de calendario denegado');
                return;
            }
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const calendar = calendars.find(cal => cal.id === externalCalendarId);
            if (!calendar || !calendar.allowsModifications) {
                alert('No tienes permisos para editar este evento externo.');
                return;
            }

            // 1. Edita el evento externo
            await Calendar.updateEventAsync(externalEventId, {
                title: taskName,
                startDate,
                endDate,
                notes: taskdescription,
                location: tasklocation,
            });

            // 2. Fuerza el refresco de eventos externos
            if (typeof setRefreshExternalEvents === 'function') {
                setRefreshExternalEvents(prev => !prev);
            }

            // 3. Actualiza la copia local (si existe)
            if (typeof updateLocalTaskByExternalId === 'function') {
                updateLocalTaskByExternalId(externalEventId, {
                    name: taskName,
                    startDate,
                    endDate,
                    description: taskdescription,
                    location: tasklocation,
                });
            }

            setModalVisible(false);
        } else {
            saveTask();
        }
    };



    const loadWorkplaces = async () => {
        try {
            const workplaces = JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || [];
            return workplaces;
        } catch (error) {
            console.error('Error al cargar los workplaces:', error);
            return [];
        }

    }

    useEffect(() => {
        const fetchWorkplaceName = async () => {
            if (taskworkplace) {
                const workplaces = await loadWorkplaces();
                const workplace = workplaces.find(w => w.id === taskworkplace);
                setWorkplaceName(workplace ? workplace.name : 'Seleccionar');
                setWorkplaceColor(workplace ? workplace.color : '#000');
            } else {
                setWorkplaceName('Seleccionar');
                setWorkplaceColor('#000');
            }
            //setRefreshWorkplaces(prev => !prev); // Forzar el refresco de workplaces

        };
        fetchWorkplaceName();
    }, [taskworkplace, modalVisible]);

    useEffect(() => {
        setRefreshWorkplaces(prev => !prev); // Forzar el refresco de workplaces
    }, [asignacionmodalvisible, modalVisible]);



    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>{editTaskId ? 'Editar' : 'Crear'} {tasktype === 'tarea' ? 'tarea' : 'evento'} para {/* puedes pasar selectedDate como prop si lo necesitas */}</Text>
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
                                            if (datePickerMode === 'start') {
                                                setStartDate(selectedDate);
                                                // Si la fecha de fin es anterior a la de inicio, ajústala
                                                if (endDate && selectedDate > endDate) {
                                                    setEndDate(selectedDate);
                                                }
                                            } else {
                                                setEndDate(selectedDate);
                                                // Si la fecha de fin es anterior a la de inicio, ajústala
                                                if (startDate && selectedDate < startDate) {
                                                    setStartDate(selectedDate);
                                                }
                                            }
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
                                                if (isExternal) {
                                                    const newStartDate = new Date(startDate);
                                                    newStartDate.setHours(hours);
                                                    newStartDate.setMinutes(minutes);
                                                    newStartDate.setSeconds(0);
                                                    newStartDate.setMilliseconds(0);
                                                    setStartDate(newStartDate);
                                                }
                                            } else {
                                                setTaskHourEnd(`${hours}:${minutes}`);
                                                if (isExternal) {
                                                    const newEndDate = new Date(endDate);
                                                    newEndDate.setHours(hours);
                                                    newEndDate.setMinutes(minutes);
                                                    newEndDate.setSeconds(0);
                                                    newEndDate.setMilliseconds(0);
                                                    setEndDate(newEndDate);

                                                }
                                                if (taskhour && endDate && startDate && endDate.toDateString() === startDate.toDateString()) {
                                                    const [h1, m1] = taskhour.split(':').map(Number);
                                                    if (hours < h1 || (hours === h1 && minutes <= m1)) {
                                                        const newEndDate = new Date(startDate);
                                                        newEndDate.setDate(newEndDate.getDate() + 1);
                                                        setEndDate(newEndDate);
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
                            onValueChange={setTaskType}
                            style={styles.input}
                            enabled={!isExternal} // <-- Deshabilita si es externo

                        >
                            <Picker.Item label="Evento" value="evento" />
                            <Picker.Item label="Tarea" value="tarea" />
                        </Picker>

                        {isExternal && (
                            <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                                No puedes cambiar el tipo de los eventos importados.
                            </Text>
                        )}

                    </View>
                    {/* Mostrar el check solo si es tarea y no estamos editando */}
                    {tasktype === 'tarea' && editTaskId !== null && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <CheckBox
                                checked={taskDone}
                                onPress={() => setTaskDone(!taskDone)}
                                checkedColor="#4CAF50"
                                uncheckedColor="#ccc"
                                containerStyle={{ padding: 0, margin: 0 }}
                            />
                            <Text>Hecha</Text>
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
                    <View style={{ marginVertical: 10 }}>
                        <Text>Workplace</Text>
                        <View
                            style={{
                                backgroundColor: workplaceColor,
                                borderRadius: 16,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                alignSelf: 'flex-start', // para que la burbuja se ajuste al texto
                                marginVertical: 6,
                                marginBottom: 10,
                            }}
                        >
                            <Text onPress={() => { setasignacionmodalvisible(true); }} style={{ color: '#fff', fontWeight: 'bold', textShadowColor: '#000'}}>
                                {workplaceName}
                            </Text>
                        </View>
                    </View>
                    <Button title="Guardar" onPress={handleSave} />
                    <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
                    <AsignacionActividadWorkplaceModal
                        asignacionmodalvisible={asignacionmodalvisible}
                        setasignacionmodalvisible={setasignacionmodalvisible}
                        taskworkplace={taskworkplace}
                        setTaskWorkplace={setTaskWorkplace}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default EdicionCreacion;