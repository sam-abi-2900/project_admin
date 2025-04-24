import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Check, ChevronLeft, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

type User = {
    id: string;
    name: string;
    avatar: string;
    assignedEvents: number;
    hasTimeOff: boolean;
    timeOffDates?: string[];
};

const users: User[] = [
    {
        id: '1',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        assignedEvents: 3,
        hasTimeOff: true,
        timeOffDates: ['2025-03-15', '2025-03-16'],
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        assignedEvents: 1,
        hasTimeOff: false,
    },
    {
        id: '3',
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        assignedEvents: 4,
        hasTimeOff: false,
    },
    {
        id: '4',
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        assignedEvents: 2,
        hasTimeOff: true,
        timeOffDates: ['2025-03-18', '2025-03-19'],
    },
];

// Event details
const eventDate = '2025-03-15';

export default function AssignScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const toggleUserSelection = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const openCalendar = (user: User) => {
        setSelectedUser(user);
        setCalendarVisible(true);
    };

    // Function to generate the calendar display
    const renderCalendarView = () => {
        if (!selectedUser) return null;

        // Get the current month - just for display
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();


        //right now just rendering few weeks, TODO - use a proper calender functionality
        const calendarDays = [];
        const startDay = 10; // Just to show a range of days

        for (let i = 0; i < 15; i++) {
            const day = startDay + i;
            const dateString = `2025-03-${day < 10 ? '0' + day : day}`;
            const isEventDate = dateString === eventDate;
            const isTimeOff = selectedUser.timeOffDates?.includes(dateString);
            const isConflict = isEventDate && isTimeOff;

            const dayStyles = [];
            if (isEventDate) dayStyles.push(theme === 'dark' ? styles.darkEventDateHighlight : styles.eventDateHighlight);
            if (isTimeOff) dayStyles.push(theme === 'dark' ? styles.darkTimeOffHighlight : styles.timeOffHighlight);
            if (isConflict) dayStyles.push(theme === 'dark' ? styles.darkConflictHighlight : styles.conflictHighlight);

            calendarDays.push(
                <View key={dateString} style={styles.calendarDay}>
                    <Text
                        style={[
                            styles.calendarDayText,
                            { color: theme === 'dark' ? colors.text : '#fff' },
                            ...dayStyles,
                            (isEventDate || isTimeOff) && styles.calendarDayTextHighlight,
                        ]}
                    >
                        {day}
                    </Text>
                    {isEventDate && (
                        <View style={[styles.eventIndicator, { backgroundColor: colors.primary }]}>
                            <Text style={styles.eventIndicatorText}>Event</Text>
                        </View>
                    )}
                    {isTimeOff && (
                        <View style={[styles.timeOffIndicator, { backgroundColor: colors.danger }]}>
                            <Text style={styles.timeOffIndicatorText}>Off</Text>
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View style={styles.calendarViewContainer}>
                <Text style={[styles.calendarMonthTitle, { color: colors.text }]}>{currentMonth} {currentYear}</Text>
                <View style={styles.weekdayHeader}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <Text key={index} style={[styles.weekdayText, { color: colors.secondaryText }]}>{day}</Text>
                    ))}
                </View>
                <View style={styles.calendarGrid}>
                    {calendarDays}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#0B0B0B' }]}>
            <View style={[styles.header, { backgroundColor: '#0B0B0B' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={'#fff'} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: '#fff' }]}>Winter Wonderland</Text>
                    <Text style={[styles.subtitle, { color: '#fff' }]}>Mar 15, 2025 • 10:00 AM</Text>
                    <View style={[styles.taskCount, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#fff' }]}>
                        <Text style={[styles.taskText, { color: '#1B1916' }]}>5 Tasks to Assign</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={[styles.userList, { backgroundColor: '#0B0B0B', borderWidth: 1, borderColor: '#3F3C39', borderBottomColor: '#3F3C39' }]}>
                {users.map((user) => (
                    <TouchableOpacity
                        key={user.id}
                        style={[
                            styles.userRow,
                            { backgroundColor: colors.card, shadowColor: '#F3A326', borderWidth: 2, borderColor: '#875E1E' },
                            selectedUsers.has(user.id) && [
                                styles.selectedUserRow,
                                { borderColor: '#F3A326' }
                            ]
                        ]}
                        onPress={() => openCalendar(user)}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity
                                style={[
                                    styles.checkbox,
                                    { borderColor: colors.border },
                                    selectedUsers.has(user.id) && [
                                        styles.checkboxSelected,
                                        { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]
                                ]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleUserSelection(user.id);
                                }}>
                                {selectedUsers.has(user.id) && <Check size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.userDetails}>
                                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                <View style={[styles.assignedCount, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#F3F4F6' }]}>
                                    <Text style={[styles.assignedText, { color: '#000' }]}>
                                        {user.assignedEvents} events assigned
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {user.hasTimeOff && (
                            <View style={styles.timeOffWarning}>
                                <AlertCircle size={16} color={colors.danger} />
                                <Text style={[styles.warningText, { color: colors.danger }]}>Time-off conflict</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { backgroundColor: theme === 'dark' ? colors.inputBackground : '#F3F4F6' }]}
                    onPress={() => router.back()}>
                    <Text style={[styles.cancelButtonText, { color: colors.secondaryText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.assignButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        // Handling  assignment -> TODO, not being implemented
                        router.back();
                    }}>
                    <Text style={styles.assignButtonText}>
                        Assign ({selectedUsers.size} selected)
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={calendarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCalendarVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {selectedUser?.name}'s Schedule
                            </Text>
                            <TouchableOpacity
                                onPress={() => setCalendarVisible(false)}
                                style={styles.closeButton}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.calendarContainer}>
                            <View style={styles.legend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Time Off</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Event Date</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: theme === 'dark' ? '#7E22CE' : '#7E22CE' }]} />
                                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Conflict</Text>
                                </View>
                            </View>

                            {/* Calendar display */}
                            {renderCalendarView()}
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    backButton: {
        marginBottom: 16,
    },
    headerContent: {
        gap: 4,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    taskCount: {
        marginTop: 8,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    taskText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#4B5563',
    },
    userList: {
        flex: 1,
        padding: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -5,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedUserRow: {
        borderWidth: 2,
        borderColor: '#4169E1',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#4169E1',
        borderColor: '#4169E1',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#1F2937',
        marginBottom: 4,
    },
    assignedCount: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    assignedText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    timeOffWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    warningText: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#EF4444',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#4B5563',
    },
    assignButton: {
        backgroundColor: '#4169E1',
    },
    assignButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    calendarContainer: {
        gap: 16,
    },
    legend: {
        flexDirection: 'row',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#6B7280',
    },
    calendarViewContainer: {
        marginTop: 16,
    },
    calendarMonthTitle: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    weekdayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    weekdayText: {
        width: 32,
        textAlign: 'center',
        fontFamily: 'Inter_500Medium',
        color: '#6B7280',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    calendarDay: {
        width: '14.28%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    calendarDayText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#1F2937',
        width: 36,
        height: 36,
        borderRadius: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 36,
        overflow: 'hidden',
    },
    calendarDayTextHighlight: {
        color: '#1F2937',
        fontFamily: 'Inter_600SemiBold',
    },
    eventDateHighlight: {
        backgroundColor: '#EBF5FF',
    },
    darkEventDateHighlight: {
        backgroundColor: '#1E3A8A',
    },
    timeOffHighlight: {
        backgroundColor: '#FEE2E2',
    },
    darkTimeOffHighlight: {
        backgroundColor: '#991B1B',
    },
    conflictHighlight: {
        backgroundColor: '#F3E8FF',
    },
    darkConflictHighlight: {
        backgroundColor: '#7E22CE',
    },
    eventIndicator: {
        backgroundColor: '#4169E1',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    eventIndicatorText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
    },
    timeOffIndicator: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    timeOffIndicatorText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
    },
    calendarPlaceholder: {
        height: 300,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});