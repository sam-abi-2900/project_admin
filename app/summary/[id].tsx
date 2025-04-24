import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

type DailyHours = {
    date: string;
    normalHours: number;
    overtimeHours: number;
    standbyHours: number;
};

const userHours: Record<string, DailyHours[]> = {
    '1': [
        { date: '2024-03-15', normalHours: 8, overtimeHours: 2, standbyHours: 1 },
        { date: '2024-03-16', normalHours: 8, overtimeHours: 1, standbyHours: 0 },
        { date: '2024-03-17', normalHours: 8, overtimeHours: 2, standbyHours: 1 },
        { date: '2024-03-18', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-19', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
    ],
    '2': [
        { date: '2024-03-15', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-16', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-17', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-18', normalHours: 8, overtimeHours: 0, standbyHours: 1 },
        { date: '2024-03-19', normalHours: 6, overtimeHours: 0, standbyHours: 0 },
    ],
    '3': [
        { date: '2024-03-15', normalHours: 8, overtimeHours: 1, standbyHours: 1 },
        { date: '2024-03-16', normalHours: 8, overtimeHours: 1, standbyHours: 1 },
        { date: '2024-03-17', normalHours: 8, overtimeHours: 0, standbyHours: 1 },
        { date: '2024-03-18', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-19', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
    ],
    '4': [
        { date: '2024-03-15', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-16', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-17', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-18', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
        { date: '2024-03-19', normalHours: 8, overtimeHours: 0, standbyHours: 0 },
    ],
};

const userNames: Record<string, string> = {
    '1': 'Sarah Wilson',
    '2': 'Michael Chen',
    '3': 'Emma Thompson',
    '4': 'David Rodriguez',
};

export default function UserHoursScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme();

    const hours = userHours[id as string] || [];
    const userName = userNames[id as string] || 'Unknown User';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: colors.text }]}>{userName}</Text>
                    <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                        Working Hours Breakdown
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {hours.map((day, index) => (
                    <View
                        key={day.date}
                        style={[styles.dayCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.dateText, { color: colors.text }]}>
                            {formatDate(day.date)}
                        </Text>
                        <View style={styles.hoursContainer}>
                            <View style={styles.hourItem}>
                                <Clock size={16} color={colors.primary} />
                                <Text style={[styles.hourText, { color: colors.text }]}>
                                    {day.normalHours}h normal
                                </Text>
                            </View>
                            <View style={styles.hourItem}>
                                <Clock size={16} color={colors.danger} />
                                <Text style={[styles.hourText, { color: colors.text }]}>
                                    {day.overtimeHours}h overtime
                                </Text>
                            </View>
                            <View style={styles.hourItem}>
                                <Clock size={16} color={colors.secondaryText} />
                                <Text style={[styles.hourText, { color: colors.text }]}>
                                    {day.standbyHours}h standby
                                </Text>
                            </View>
                        </View>
                    </View>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
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
    content: {
        flex: 1,
        padding: 16,
    },
    dayCard: {
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
    dateText: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 12,
    },
    hoursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
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
}); 