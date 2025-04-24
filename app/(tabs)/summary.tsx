import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, User, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

type User = {
    id: string;
    name: string;
    avatar: string;
    totalHours: number;
    overtimeHours: number;
    standbyHours: number;
};

const users: User[] = [
    {
        id: '1',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        totalHours: 45,
        overtimeHours: 5,
        standbyHours: 2,
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        totalHours: 38,
        overtimeHours: 0,
        standbyHours: 1,
    },
    {
        id: '3',
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        totalHours: 42,
        overtimeHours: 2,
        standbyHours: 3,
    },
    {
        id: '4',
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        totalHours: 40,
        overtimeHours: 0,
        standbyHours: 0,
    },
];

export default function SummaryScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()).toString());
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);

    // This Function is used to get week number
    function getWeekNumber(date: Date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    //This is the Dummy data for dropdowns for the work time summary screen
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = ['2022', '2023', '2024', '2025'];
    const weeks = Array.from({ length: 52 }, (_, i) => (i + 1).toString());

    const navigateToUserDetails = (userId: string) => {
        router.push(`../summary/${userId}`);
    };

    const renderDropdown = (items: string[], selected: string, onSelect: (item: string) => void, visible: boolean, onClose: () => void) => {
        if (!visible) return null;

        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={onClose}>
                    <View style={[styles.dropdown, { backgroundColor: colors.card }]}>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.dropdownItem,
                                    selected === item && { backgroundColor: colors.primary + '20' }
                                ]}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}>
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>Working Hours Summary</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                    View and manage employee working hours
                </Text>
            </View>

            <View style={[styles.selectorContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowMonthDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>{selectedMonth}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowYearDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>{selectedYear}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selectorButton, { borderColor: colors.border }]}
                    onPress={() => setShowWeekDropdown(true)}>
                    <Text style={[styles.selectorText, { color: colors.text }]}>Week {selectedWeek}</Text>
                    <ChevronDown size={16} color={colors.text} />
                </TouchableOpacity>
            </View>

            {renderDropdown(months, selectedMonth, setSelectedMonth, showMonthDropdown, () => setShowMonthDropdown(false))}
            {renderDropdown(years, selectedYear, setSelectedYear, showYearDropdown, () => setShowYearDropdown(false))}
            {renderDropdown(weeks, selectedWeek, setSelectedWeek, showWeekDropdown, () => setShowWeekDropdown(false))}

            <ScrollView style={styles.userList}>
                {users.map((user) => (
                    <TouchableOpacity
                        key={user.id}
                        style={[styles.userCard, { backgroundColor: colors.card }]}
                        onPress={() => navigateToUserDetails(user.id)}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.userDetails}>
                                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                <View style={styles.hoursContainer}>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.primary} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>
                                            {user.totalHours}h total
                                        </Text>
                                    </View>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.danger} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>
                                            {user.overtimeHours}h overtime
                                        </Text>
                                    </View>
                                    <View style={styles.hourItem}>
                                        <Clock size={16} color={colors.secondaryText} />
                                        <Text style={[styles.hourText, { color: colors.text }]}>
                                            {user.standbyHours}h standby
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    userList: {
        flex: 1,
        padding: 16,
    },
    userCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderColor: '#3F3C39',
        borderWidth: 1,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 8,
    },
    hoursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hourItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    hourText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    selectorContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#3F3C39',
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    selectorText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: '80%',
        maxHeight: 300,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#3F3C39',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
}); 