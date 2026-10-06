import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../components/StyledComponents/styles';

const AdminDenuncias = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Denuncias</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary || '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.greenPet || '#028596',
    },
});

export default AdminDenuncias;
