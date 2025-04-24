import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Bell, Menu, MoveVertical as MoreVertical, MapPin, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { isNewWebImplementationEnabled } from 'react-native-gesture-handler/lib/typescript/EnableNewWebImplementation';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  priority?: string;
  tag?: string;
  avatars: string[];
};

const events: Event[] = [
  {
    id: '1',
    title: 'Winter Wonderland',
    date: 'Mar 15, 2025',
    time: '10:00 AM',
    location: 'Belgium',
    // // coordinates -> implemented
    //     tasks -> separate table with event id and task id
    //     assign the events to vendors, a table with vendor id, assigner id, event id




    attendees: 50,
    priority: 'high',
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    ],
  },
  {
    id: '2',
    title: 'Tomorrowland',
    date: 'Mar 18, 2024',
    time: '2:30 PM',
    location: 'Belgium',
    attendees: 2200,
    priority: 'medium',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    ],
  },
  {
    id: '3',
    title: 'Football Tournament',
    date: 'Mar 20, 2025',
    time: '9:00 AM',
    location: 'Training Room A',
    attendees: 25,
    priority: 'low',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    ],
  },
];

export default function HomeScreen() {
  const { colors, theme } = useTheme();

  const staticStyles = StyleSheet.create({
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    notificationButton: {
      position: 'relative',
      marginRight: 12,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    tab: {
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    eventList: {
      padding: 16,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    eventActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    priorityText: {
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
    },
    eventLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    eventFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    attendees: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarStack: {
      flexDirection: 'row',
      marginLeft: 12,
    },
    attendeeAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#fff',
    },
    fabIcon: {
      fontSize: 24,
      color: '#000',
      fontFamily: 'Inter_500Medium',
    },
  });

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#1B1916',
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter_600SemiBold',
      color: colors.text,
      marginLeft: 12,
    },
    notificationBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.danger,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationCount: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
    },
    searchContainer: {
      padding: 16,
      backgroundColor: '#1B1916',
    },
    searchInput: {
      backgroundColor: '#1B1916',
      borderRadius: 12,
      padding: 12,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.text,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#1B1916',
      paddingHorizontal: 16,
      paddingBottom: 16,
      justifyContent: 'center',
      gap: 32,
    },
    tabText: {
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      color: colors.secondaryText,
    },
    activeTabText: {
      color: '#F3A326',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      paddingBottom: 8,
    },
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'dark' ? 0.4 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    eventTitle: {
      fontSize: 18,
      fontFamily: 'Inter_600SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    eventDateTime: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.secondaryText,
    },
    priorityTag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginRight: 8,
    },
    highPriorityTag: {
      backgroundColor: colors.highPriorityBg,
    },
    mediumPriorityTag: {
      backgroundColor: colors.mediumPriorityBg,
    },
    lowPriorityTag: {
      backgroundColor: colors.lowPriorityBg,
    },
    highPriorityText: {
      color: colors.highPriorityText,
    },
    mediumPriorityText: {
      color: colors.mediumPriorityText,
    },
    lowPriorityText: {
      color: colors.lowPriorityText,
    },
    tag: {
      backgroundColor: theme === 'dark' ? '#4B5563' : '#F3E8FF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
    },
    tagText: {
      color: theme === 'dark' ? '#E9D5FF' : '#9333EA',
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
    },
    locationText: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.secondaryText,
    },
    attendeesText: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.secondaryText,
    },
    moreAttendees: {
      backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    moreAttendeesText: {
      fontSize: 10,
      fontFamily: 'Inter_500Medium',
      color: colors.secondaryText,
    },
    assignButton: {
      borderColor: '#F3A326',
      borderWidth: 1,
      backgroundColor: '#201E1B',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    assignButtonText: {
      color: '#F3A326',
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });

  return (
    <SafeAreaView style={themedStyles.container}>
      <View style={themedStyles.header}>
        <View style={staticStyles.headerLeft}>
          <TouchableOpacity>
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={themedStyles.title}>Janik</Text>
            <Text style={themedStyles.eventDateTime}>Events Technical Manager</Text>
          </View>
        </View>
        <View style={staticStyles.headerRight}>
          <TouchableOpacity
            style={staticStyles.notificationButton}
            onPress={() => router.push('/notifications')}>
            <Bell size={24} color={colors.text} />
            <View style={themedStyles.notificationBadge}>
              <Text style={themedStyles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
          {/* <ThemeToggle /> */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces' }}
            style={staticStyles.avatar}
          />
        </View>
      </View>

      <View style={themedStyles.searchContainer}>
        <TextInput
          style={[themedStyles.searchInput, { borderWidth: 1, borderColor: '#AFACA7' }]}
          placeholder="Search events..."
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <View style={themedStyles.tabBar}>
        <TouchableOpacity style={[staticStyles.tab, themedStyles.activeTab]}>
          <Text style={[themedStyles.tabText, themedStyles.activeTabText]}>Pending(3)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={staticStyles.tab}>
          <Text style={themedStyles.tabText}>Assigned(0)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={staticStyles.eventList}>
        {events.map((event) => (
          <View key={event.id} style={[themedStyles.eventCard, { borderWidth: 1, borderColor: '#AFACA7' }]}>
            <View style={staticStyles.eventHeader}>
              <View>
                <Text style={themedStyles.eventTitle}>{event.title}</Text>
                <Text style={themedStyles.eventDateTime}>
                  {event.date} • {event.time}
                </Text>
              </View>
              {/* <View style={staticStyles.eventActions}>
                {event.priority && (
                  <View style={[
                    themedStyles.priorityTag,
                    event.priority === 'high' ? themedStyles.highPriorityTag :
                      event.priority === 'medium' ? themedStyles.mediumPriorityTag :
                        themedStyles.lowPriorityTag
                  ]}>
                    <Text style={[
                      staticStyles.priorityText,
                      event.priority === 'high' ? themedStyles.highPriorityText :
                        event.priority === 'medium' ? themedStyles.mediumPriorityText :
                          themedStyles.lowPriorityText
                    ]}>
                      {event.priority === 'high' ? 'High Priority' :
                        event.priority === 'medium' ? 'Medium Priority' :
                          'Low Priority'}
                    </Text>
                  </View>
                )}
                {event.tag && (
                  <View style={themedStyles.tag}>
                    <Text style={themedStyles.tagText}>{event.tag}</Text>
                  </View>
                )}
                <TouchableOpacity>
                  <MoreVertical size={20} color={colors.secondaryText} />
                </TouchableOpacity>
              </View> */}
            </View>

            <View style={staticStyles.eventLocation}>
              <MapPin size={16} color={colors.secondaryText} />
              <Text style={themedStyles.locationText}>{event.location}</Text>
            </View>

            <View style={staticStyles.eventFooter}>
              <View style={staticStyles.attendees}>
                <Users size={16} color={colors.secondaryText} />
                <Text style={themedStyles.attendeesText}>{event.attendees} Attendees</Text>
                <View style={staticStyles.avatarStack}>
                  {event.avatars.map((avatar, index) => (
                    <Image
                      key={index}
                      source={{ uri: avatar }}
                      style={[
                        staticStyles.attendeeAvatar,
                        { marginLeft: index > 0 ? -12 : 0, borderColor: theme === 'dark' ? colors.card : '#fff' },
                      ]}
                    />
                  ))}
                  {event.attendees > 2 && (
                    <View style={[staticStyles.attendeeAvatar, themedStyles.moreAttendees, { marginLeft: -12 }]}>
                      <Text style={themedStyles.moreAttendeesText}>+{event.attendees - 2}</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity style={themedStyles.assignButton} onPress={() => router.push('/events/assign')}>
                <Text style={themedStyles.assignButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={themedStyles.fab} onPress={() => router.push('/events/new')}>
        <Text style={staticStyles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}