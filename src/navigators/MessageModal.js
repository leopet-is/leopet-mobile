import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../components/StyledComponents/styles';

const MessageModal = ({ route, navigation }) => {
    const { title, message } = route.params || { title: 'Mensaje', message: '' };

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.greenPet || '#028596',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.pinkPet || '#F28E8B',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MessageModal;
