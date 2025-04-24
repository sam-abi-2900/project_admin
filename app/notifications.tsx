import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

type Notification = {
  id: string;
  type: 'checkin' | 'overtime';
  contractorName: string;
  time: string;
};

const notifications: Notification[] = [
  {
    id: '1',
    type: 'checkin',
    contractorName: 'John Doe',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'overtime',
    contractorName: 'Jane Smith',
    time: '1 hour ago',
  },
];

export default function NotificationsScreen() {
  const { colors, theme } = useTheme();

  const handleApprove = (id: string) => {
    // Handle approve action, add some backend logic here
    console.log('Approved notification:', id);
  };

  const handleReject = (id: string) => {
    // Handle reject action, add some backend logic here
    console.log('Rejected notification:', id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      </View>

      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) => (
          <View
            key={notification.id}
            style={[styles.notificationCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.notificationTitle, { color: colors.text }]}>
              {notification.type === 'checkin'
                ? 'Check-in Override Request'
                : 'Overtime Request'}
            </Text>
            <Text style={[styles.contractorName, { color: colors.text }]}>
              {notification.contractorName}
            </Text>
            <Text style={[styles.time, { color: colors.secondaryText }]}>
              {notification.time}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleApprove(notification.id)}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(notification.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  contractorName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
}); 