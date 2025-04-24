import { View, Text, StyleSheet } from 'react-native';

export default function EventsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Events Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
});