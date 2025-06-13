import React from 'react';
import { Modal, View, Text, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';

const SoloVista = ({
    visible,
    onClose,
    viewTask,
    tasks,
    selectedDate,
    startEditTask,
    deleteTask,
    setViewTask,
    styles
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
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
                <View style={{ marginTop: 10, zIndex: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                onClose();
                                startEditTask(viewTask);
                            }}
                            style={{ marginHorizontal: 8 }}
                        >
                            <Ionicons name="pencil" size={24} color="#2196F3" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onClose();
                                deleteTask(viewTask.id, viewTask.startDate, viewTask.endDate);
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
                                        if (viewTask.endHour && endD) {
                                            const sameDay = startD.toDateString() === endD.toDateString();
                                            if (sameDay) {
                                                return `${viewTask.startHour} - ${viewTask.endHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                                            } else {
                                                return `${viewTask.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]} - ${viewTask.endHour} ${dias[endD.getDay()]}, ${endD.getDate()} ${meses[endD.getMonth()]}`;
                                            }
                                        } else {
                                            return `${viewTask.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                                        }
                                    })()}
                                </Text>
                            )}
                            {viewTask && viewTask.type === 'tarea' && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <CheckBox
                                        checked={(tasks[selectedDate] || []).find(t => t.id === viewTask?.id)?.done}
                                        onPress={async () => {
                                            const updatedDateTasks = [...(tasks[selectedDate] || [])];
                                            const idx = updatedDateTasks.findIndex(t => t.id === viewTask?.id);
                                            if (idx !== -1) {
                                                updatedDateTasks[idx] = {
                                                    ...updatedDateTasks[idx],
                                                    done: !updatedDateTasks[idx].done,
                                                };
                                                const updatedTasks = { ...tasks, [selectedDate]: updatedDateTasks };
                                                setViewTask(prev => ({ ...prev, done: !prev.done }));
                                                if (typeof setTasks === 'function') setTasks(updatedTasks);
                                                try {
                                                    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
                                                } catch (e) {
                                                    console.error('Error guardando tareas en AsyncStorage:', e);
                                                }
                                            }
                                        }}
                                        checkedColor="#4CAF50"
                                        uncheckedColor="#ccc"
                                        containerStyle={styles.checkBoxCompact}
                                        wrapperStyle={{ margin: 0, padding: 0 }}
                                        title=""
                                    />
                                </View>
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
                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </View>
    </Modal>
);

export default SoloVista;