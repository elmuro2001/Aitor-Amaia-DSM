import { View, Text, Modal, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CalendarioStyle from '../styles/CalendarioStyle';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreacionWorkplaceModal from './CreacionWorkplace';



const AsignacionActividadWorkplaceModal = ({ asignacionmodalvisible, setasignacionmodalvisible, workplaces, setTaskWorkplace }) => {

    const [existingWorkplaces, setExistingWorkplaces] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const loadexistingWorkplaces = async () => {
        try {
            setExistingWorkplaces(JSON.parse(await AsyncStorage.getItem('WORKPLACES')) || []);
        } catch (error) {
            console.error('Error al cargar los workplaces:', error);
        }
    }

    useEffect(() => {
        if (asignacionmodalvisible) {
            // Si loadexistingWorkplaces es async, usa una función interna
            const cargar = async () => {
                await loadexistingWorkplaces();
            };
            cargar();
        }
    }, [asignacionmodalvisible,modalVisible]);

    return (
        <Modal
            visible={asignacionmodalvisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setasignacionmodalvisible(false)}
        >
            <View style={CalendarioStyle.modalContainer}>
                <View style={CalendarioStyle.modalContent}>
                    <Text style={CalendarioStyle.modalTitle} >Asignar Actividad a Workplace</Text>
                    <FlatList
                        data={existingWorkplaces}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{
                                backgroundColor: item.color=='#FFFFFF' ? '#EEE' : item.color,
                                borderRadius: 16,
                                paddingHorizontal: 14,
                                paddingVertical: 4,
                                marginHorizontal: 6,
                                marginVertical: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 60,
                            }}>
                                <Button
                                    title={item.name}
                                    color={item.color=='#FFFFFF' ? '#EEE' : item.color}
                                    onPress={() => {
                                        setTaskWorkplace(item.id);
                                        setasignacionmodalvisible(false);
                                    }}
                                />
                            </View>
                        )}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setTaskWorkplace(null);
                                    setasignacionmodalvisible(false);
                                }}
                                style={{
                                    backgroundColor: '#EEE',
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 20,
                                    marginRight: 12,
                                    borderWidth: 1,
                                    borderColor: '#AAA',
                                }}
                            >
                                <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 14 }}>
                                    Desasignar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 20,
                                    marginRight: 12,
                                    borderWidth: 1,
                                    borderColor: '#388E3C',
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                                    Crear Workplace
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setasignacionmodalvisible(false)}
                                style={{
                                    backgroundColor: '#2196F3',
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 20,
                                    marginLeft: 12,
                                    borderWidth: 1,
                                    borderColor: '#1976D2',
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <CreacionWorkplaceModal
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                onClose={() => setModalVisible(false)}
                            />

                        </View>
                    </View>
                </View>
            </View>
        </Modal>


    )
}

export default AsignacionActividadWorkplaceModal;