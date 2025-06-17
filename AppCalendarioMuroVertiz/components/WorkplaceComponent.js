import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Touchable } from "react-native";
import CreacionWorkplaceModal from "../modales/CreacionWorkplace"; // Importar el modal de creación de workplac
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage para manejar el almacenamiento local
import { Ionicons } from '@expo/vector-icons';
import EdicionBorradoWorkplaceModal from "../modales/EdicionBorradoWorkplace";


const WorkplaceComponent = ({ selectedWorkplaces, setSelectedWorkplaces }) => {

    // Definir las variables
    const [workplace, setWorkplace] = useState([]); // Estado para almacenar los workplaces]);
    const [modalVisible, setModalVisible] = useState(false);//necesario para mostrar el modal de creación de workplace
    const [modalworkplace, setModalWorkplace] = useState(false); // Estado para visualizar modificaciones de un workplace
    const [selectedWorkplace, setSelectedWorkplace] = useState(null); // Estado para almacenar el workplace seleccionado

    // cargar workplaces del asyncstorage
    const loadWorkplaces = async () => {
        try {
            const storedWorkplaces = await AsyncStorage.getItem('WORKPLACES');
            if (storedWorkplaces) {
                const parsedWorkplaces = JSON.parse(storedWorkplaces);
                setWorkplace(parsedWorkplaces);
            }
        } catch (error) {
            console.error('Error cargando workplaces:', error);
        }
    }

    // Cargar los workplaces al montar el componente
    useEffect(() => {
        loadWorkplaces();
    }, [modalVisible,modalworkplace]);


    // Funcion para añadir un workplace al array de workplaces de calendario
    const AddWorkplace = async (id) => {
        selectedWorkplaces.includes(id) ?
            setSelectedWorkplaces(selectedWorkplaces.filter(workplaceId => workplaceId !== id)) : // Si ya está seleccionado, lo quitamos
            setSelectedWorkplaces([...selectedWorkplaces, id]); // Si no está seleccionado, lo añadimos
    }



    return (


        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {/* Mostrar el modal de creación de workplace */}
            <CreacionWorkplaceModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            
            {/*Mostrar la lista de workplaces*/}
            <View style={{ flex: 11, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10 }}>
                <FlatList
                    data={workplace}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        //si el workplace está seleccionado, mostrarlo una burbuj
                        <TouchableOpacity style={{ paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#ccc' }} onLongPress={() => { setModalWorkplace(true); setSelectedWorkplace(item); }} onPress={() => AddWorkplace(item.id)}>
                            <Text style={{ fontSize: 18, color: item.color, fontWeight: selectedWorkplaces.includes(item.id) ? '900' : '300' }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    horizontal={true} // Mostrar la lista horizontalmente
                    showsHorizontalScrollIndicator={false} // Ocultar la barra de desplazamiento horizontal
                />
            </View>

            {/* Mostrar el modal de edición y borrado de workplace solo si se ha seleccionado un workplace */}
            {selectedWorkplace && (
            <EdicionBorradoWorkplaceModal
                modalworkplace={modalworkplace}
                setModalWorkplace={setModalWorkplace}
                selectedWorkplace={selectedWorkplace}
                setSelectedWorkplace={setSelectedWorkplace}
            />
            )}

            {/* Botón para abrir el modal de creación de workplace */}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flex: 1 }}>
                    <Ionicons name={'add'} size={18} color="#000" />
                </TouchableOpacity>
            </View>
        </View>

    );


}

export default WorkplaceComponent;