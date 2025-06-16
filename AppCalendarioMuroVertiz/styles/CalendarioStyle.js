import { StyleSheet, Dimensions } from 'react-native';
import dimensions from '../config/dimensiones';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        width: '100%',
        height: '20%',
    },
    headerImage: {
        width: screenWidth,
        height: '100%',
        resizeMode: 'cover',
    },
    monthContainer: {
        marginTop: 12,
        marginLeft: 16,
    },
    monthText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    calendar: {
        marginHorizontal: 16,
        marginBottom: dimensions.calendarMarginBottom,
        borderRadius: 8,
        overflow: 'hidden',
    },
    taskSection: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
        padding: 8,
        borderRadius: 8,
    },
    taskTitle: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 35,
    },
    customHeaderContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    customHeaderText: {
        fontSize: dimensions.headerText,
        color: '#333',
    },
    yearText: {
        position: 'absolute',
        top: screenHeight * 0.05,
        right: 20,
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    calendarWrapper: {
        height: dimensions.dayHeight * 7,
        flexGrow: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
        marginTop: 0,
    },
    footer: {
        height: dimensions.footerHeight,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        marginBottom: 0,
        paddingBottom: 0,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    fabOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 2,
        right: 30,
    },
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
    colorPickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        gap: 8,
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        margin: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#333',
        opacity: 0.5,
    },
    checkBoxCompact: {
        padding: 0,
        margin: 0,
        width: 22,
        height: 22,
        minWidth: 22,
        minHeight: 22,
        backgroundColor: 'transparent',
        borderWidth: 0,
        elevation: 0,
    },
    taskItem: {
        backgroundColor: '#f5f5f5', // gris clarito
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        // Sombra para Android
        elevation: 3,
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },

});
