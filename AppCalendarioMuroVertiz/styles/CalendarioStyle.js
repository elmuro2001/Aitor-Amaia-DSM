import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        width: '100%',
        height: 180,
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
        flex: 1,
        marginTop: 8,
        marginHorizontal: 16,
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
        fontSize: 25,
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
});
