//modal para la creación de workplace con nombre y color, con un identificador único
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPicker from '../components/ColorPicker';



const CreacionWorkplaceModal = ({ modalVisible, setModalVisible }) => { //importamos la variable modalVisible y setModalVisible para controlar la visibilidad del modal
    const [workplaceName, setWorkplaceName] = useState('');
    const [workplaceColor, setWorkplaceColor] = useState('#000'); // Color por defecto negro
    const [workplaceId, setWorkplaceId] = useState('');

    // Función para generar un ID único
    const generateUniqueId = () => {
        return Date.now().toString() + Math.random().toString(36).slice(2, 11);
    };

    // Función para manejar la creación del workplace
    const handleCreateWorkplace = async () => {


        if (!workplaceName) {
            alert('Por favor, ingresa un nombre para el workplace.');
            return;
        }
        //si el nombre que se quiere ingresar ya está en uso, se le pide al usuario que ingrese otro nombre
        const existingWorkplaces = JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || [];
        const isNameTaken = existingWorkplaces.some(workplace => workplace.name === workplaceName);

        if (isNameTaken) {
            alert('El nombre del workplace ya está en uso. Por favor, ingresa otro nombre.');
            return;
        }

        const newWorkplace = {
            id: generateUniqueId(),
            name: workplaceName,
            color: workplaceColor,
        };

        try {
            // Guardar el nuevo workplace en AsyncStorage
            const existingWorkplaces = JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || [];
            existingWorkplaces.push(newWorkplace);
            await AsyncStorage.setItem('WORKPLACES', JSON.stringify(existingWorkplaces));
            setModalVisible(false); //cerrar el modal después de crear el workplace

            // Limpiar los campos después de crear el workplace
            setWorkplaceName(''); // Limpiar el campo de nombre
            setWorkplaceColor('#FFFFFF'); // Limpiar el color seleccionado
            setWorkplaceId(''); // Limpiar el ID del workplace
        } catch (error) {
            console.error('Error al crear el workplace:', error);
        }
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true} //para que el fondo sea transparente
            onRequestClose={() => setModalVisible(false)} //funcion propia de Modal cuando el SO fuerza el cierre
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Crear Workplace</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del Workplace"
                        value={workplaceName}
                        onChangeText={setWorkplaceName}
                    />
                    <ColorPicker selectColor={workplaceColor} onSelect={setWorkplaceColor} />
                    <Button title="Crear" onPress={handleCreateWorkplace} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({ //pasar a styles.js
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
});


export default CreacionWorkplaceModal;