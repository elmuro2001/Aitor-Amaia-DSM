import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../styles/CalendarioStyle';

const COLORS = [
  { name: 'Negro', value: '#000000' },
  { name: 'Gris', value: '#505050' },
    { name: 'Blanco', value: '#AAAAAA' },
  { name: 'Rojo', value: '#FF2020' },
  { name: 'Naranja', value: '#FFA520' },
  { name: 'Amarillo', value: '#FFFF20' },
  { name: 'Verde oscuro', value: '#80EE00' },
  { name: 'Verde claro', value: '#00EE80' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Azul', value: '#0040FF' },
  { name: 'Morado', value: '#8040FF' },
  { name: 'Fuxia', value: '#FF00FF' },
];

const ColorPicker = ({ selectedColor, onSelect }) => (
  <View style={styles.colorPickerContainer}>
    {COLORS.map((color) => (
      <TouchableOpacity
        key={color.value}
        style={[
          styles.colorCircle,
          {
            backgroundColor: color.value,
            borderColor: selectedColor === color.value ? '#333' : '#ccc',
          },
        ]}
        onPress={() => onSelect(color.value)}
      >
        {selectedColor === color.value && <View style={styles.selectedCircle} />}
      </TouchableOpacity>
    ))}
  </View>
);

export default ColorPicker;
