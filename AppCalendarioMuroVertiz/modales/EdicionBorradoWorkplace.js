import React from 'react';
import { View, Moal, Text, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPicker from '../components/ColorPicker';
import { ioicons, MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/CalendarioStyle'; // Asegúrate de tener un archivo de estilos adecuado

const EdicionBorradoWorkplaceModal = ({ modalworkplace, setModalWorkplace, selectedWorkplace, setSelectedWorkplace }) => {
    // Extraer el workplace seleccionado
    const id = selectedWorkplace.id;
    const [name, setName] = React.useState(selectedWorkplace.name);
    const [color, setColor] = React.useState(selectedWorkplace.color);

    // Función para manejar la edición del workplace
    const handleEditWorkplace = async () => {

        if (!name) {
            alert('Por favor, ingresa un nombre para el workplace.');
            return;
        }

        try {
            //coger el array de workplaces del AsyncStorage
            const existingWorkplaces = JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || [];
            // quitar el workplace seleccionado del array
            const updatedWorkplaces = existingWorkplaces.filter(workplace => workplace.id !== id);
            // verificar si el nombre ya está en uso
            const isNameTaken = updatedWorkplaces.some(workplace => workplace.name === name);
            if (isNameTaken) {
                alert('El nombre del workplace ya está en uso. Por favor, ingresa otro nombre.');
                return;
            }
            // crear el nuevo workplace con el nombre y color actualizados
            const updatedWorkplace = {
                id: id, // Mantener el mismo ID
                name: name,
                color: color,
            };
            // agregar el nuevo workplace al array
            updatedWorkplaces.push(updatedWorkplace);
            await AsyncStorage.setItem('WORKPLACES', JSON.stringify(updatedWorkplaces));
            setModalWorkplace(false); //cerrar el modal después de editar el workplace
            setSelectedWorkplace(null); // Limpiar el workplace seleccionado
        } catch (error) {
            console.error('Error al editar el workplace:', error);
        }
    };

    const handleDeleteWorkplace = async () => {

        if (!selectedWorkplace) {
            alert('No hay un workplace seleccionado para borrar.'); //no debería pasar
            return;
        }

        // Borrar el workplace del AsyncStorage
        const existingWorkplaces = JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || [];
        const updatedWorkplaces = existingWorkplaces.filter(workplace => workplace.id !== selectedWorkplace.id);
        await AsyncStorage.setItem('WORKPLACES', JSON.stringify(updatedWorkplaces));


        //Borrar la referencia al workplace borrado en las tareas
        const existingTasks = JSON.parse(await AsyncStorage.getItem('TASKS')) || {};
        // Iterar sobre las tareas y eliminar la referencia al workplace borrado
        Object.keys(existingTasks).forEach(date => {
            existingTasks[date] = existingTasks[date].filter(task => task.taskworkplace !== selectedWorkplace.id);
        });
        // Guardar las tareas actualizadas en AsyncStorage
        await AsyncStorage.setItem('TASKS', JSON.stringify(existingTasks));

        setModalWorkplace(false); // Cerrar el modal después de borrar el workplace
        setSelectedWorkplace(null); // Limpiar el workplace seleccionado
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalworkplace}
            onRequestClose={() => {
                setModalWorkplace(false);
                setSelectedWorkplace(null); // Limpiar el workplace seleccionado al cerrar el modal
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>Editar o Borrar Workplace</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={name}
                        value={name}
                        onChangeText={setName}
                    />
                    <ColorPicker
                        selectedColor={color}
                        onSelect={setColor}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                            <TouchableOpacity onPress={handleEditWorkplace} >
                                <MaterialCommunityIcons name="content-save" size={24} color="blue" style={{marginRight: 10}} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteWorkplace} >
                                <MaterialCommunityIcons name="trash-can" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => { setModalWorkplace(false); setSelectedWorkplace(null); }} style={{ marginRight: 10 }}>
                                <MaterialCommunityIcons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    );





}





export default EdicionBorradoWorkplaceModal;