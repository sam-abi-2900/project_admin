import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';

const DropDownSelector = ({ t }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    let options = [
        { id: '1', label: 'Home' },
        { id: '2', label: 'Warehouse' },
        { id: '3', label: 'Truck' },
        { id: '4', label: 'Event' },
    ];
    const wh = [
        { id: '1', label: 'WareHouse' },
    ];
    const ev = [
        { id: '1', label: 'Home' },
        { id: '2', label: 'Warehouse' },
        { id: '3', label: 'Truck' },
        { id: '4', label: 'Event' },
    ];

    if (t == 'warehouse') {
        options = wh
    } else if (t == 'events') {
        options = ev
    }


    const handleSelect = (item) => {
        setSelectedItem(item);
        setModalVisible(false);
    };

    const renderOption = ({ item }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => handleSelect(item)}
        >
            <Text style={styles.optionText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownText}>
                    {'Select an option'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select an Option</Text>
                            <FlatList
                                data={options}
                                renderItem={renderOption}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    </SafeAreaView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownIcon: {
        fontSize: 14,
        color: '#555',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    modalContent: {
        paddingTop: 20,
        paddingBottom: 30,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    option: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default DropDownSelector;
