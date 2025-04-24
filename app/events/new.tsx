import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Platform,
    FlatList,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock, CircleAlert as AlertCircle, Plus, Minus, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';

type Priority = 'low' | 'medium' | 'high';
type Task = {
    id: string;
    name: string;
    isPredefined?: boolean;
    isSelected?: boolean;
    dependsOn?: string; // ID of the task this depends on
};
// Add event type definition, here appointment type is the third type of event, TODO -> refactor it to warehouse-event
type EventType = 'warehouse' | 'Events' | 'appointment';

// predefined tasks list
const PREDEFINED_TASKS: Task[] = [
    { id: 'check-in-warehouse', name: 'Check in to warehouse', isPredefined: true },
    { id: 'task2', name: 'Containerize Empty Bottles', isPredefined: true },
    { id: 'task3', name: 'Stack crates into Truck', isPredefined: true },
    { id: 'check-out', name: 'Check out of warehouse', isPredefined: true }
];

export default function NewEventScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme();
    // Add event type state
    const [eventType, setEventType] = useState<EventType>('warehouse');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showTaskPicker, setShowTaskPicker] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Event title is required';
        }

        // Validation check for fields based on event type
        if (eventType === 'warehouse' || eventType === 'appointment') {
            if (!location.trim()) {
                newErrors.location = 'Location is required';
            }
        }

        if (endDate < startDate) {
            newErrors.date = 'End time must be after start time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        //backend logic needs to happen here i thing, using settimeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        router.back();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const addTask = () => {
        if (selectedTaskId) {
            const taskToAdd = PREDEFINED_TASKS.find(task => task.id === selectedTaskId);
            if (taskToAdd && !tasks.some(task => task.id === selectedTaskId)) {
                setTasks([...tasks, { ...taskToAdd, isSelected: false }]);
                setSelectedTaskId('');
            }
        }
    };

    const updateTaskName = (id: string, name: string) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, name } : task));
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const togglePredefinedTask = (id: string) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, isSelected: !task.isSelected };
            }
            return task;
        }));
    };

    //this function is no longer being used, need refactor
    const getVisibleTasks = () => {
        const visibleTasks = tasks.filter(task => {
            // Always show non-predefined tasks
            if (!task.isPredefined) return true;

            // For warehouse type, only show warehouse-related tasks
            if (eventType === 'warehouse') {
                return task.id === 'check-in-warehouse' || task.id === 'check-out';
            }

            // For Events and appointment types
            if (eventType === 'Events' || eventType === 'appointment') {
                // Always show warehouse and event check-in options
                if (task.id === 'check-in-warehouse' || task.id === 'check-in-event') {
                    return true;
                }

                // For truck/car check-in, only show if warehouse is checked in and event is not checked in
                if (task.id === 'check-in-vehicle') {
                    const warehouseCheckedIn = tasks.find(t => t.id === 'check-in-warehouse')?.isSelected;
                    const eventCheckedIn = tasks.find(t => t.id === 'check-in-event')?.isSelected;
                    return warehouseCheckedIn && !eventCheckedIn;
                }

                // For check-out, show with modified text
                if (task.id === 'check-out') {
                    return true;
                }
            }

            return false;
        });

        // Sorting the tasks to maintain the desired order
        const taskOrder = ['check-in-warehouse', 'check-in-vehicle', 'check-in-event'];
        visibleTasks.sort((a, b) => {
            if (!a.isPredefined && !b.isPredefined) return 0;
            if (!a.isPredefined) return 1; // Move custom tasks to the end
            if (!b.isPredefined) return -1;

            const aIndex = taskOrder.indexOf(a.id);
            const bIndex = taskOrder.indexOf(b.id);
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

        // Add check-out task at the end
        const checkOutTask = visibleTasks.find(task => task.id === 'check-out');
        if (checkOutTask) {
            // Remove check-out from current position
            const filteredTasks = visibleTasks.filter(task => task.id !== 'check-out');
            // Add it back at the end
            filteredTasks.push(checkOutTask);
            return filteredTasks;
        }

        return visibleTasks;
    };

    // Update the task rendering to show correct check-out text
    const getTaskName = (task: Task) => {
        if (task.id === 'check-out') {
            if (eventType === 'Events') {
                return 'Check out of events';
            } else if (eventType === 'appointment') {
                return 'Check out of warehouse-events';
            }
        }
        return task.name;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: '#1B1916', borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Event</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Add Event Type Selector */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Event Type</Text>
                    <View style={styles.typeButtons}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'warehouse' ? colors.primary : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('warehouse')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'warehouse' ? '#FFFFFF' : '#FFFFFF' }
                                ]}>
                                Warehouse
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'Events' ? colors.primary : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('Events')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'Events' ? '#FFFFFF' : '#FFFFFF' }
                                ]}>
                                Events
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                {
                                    backgroundColor: eventType === 'appointment' ? colors.primary : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setEventType('appointment')}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    { color: eventType === 'appointment' ? '#FFFFFF' : '#FFFFFF' }
                                ]}>
                                Warehouse - Events
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Event Title</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: errors.title ? colors.danger : colors.border
                            }
                        ]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter event title"
                        placeholderTextColor={colors.secondaryText}
                    />
                    {errors.title && (
                        <Text style={[styles.errorText, { color: colors.danger }]}>{errors.title}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
                    <TouchableOpacity
                        style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => setShowStartPicker(true)}>
                        <Clock size={20} color={colors.secondaryText} />
                        <Text style={[styles.dateButtonText, { color: colors.text }]}>
                            {formatDate(startDate)} at {formatTime(startDate)}
                        </Text>
                        <ChevronDown size={20} color={colors.secondaryText} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dateButton, { marginTop: 8, backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => setShowEndPicker(true)}>
                        <Clock size={20} color={colors.secondaryText} />
                        <Text style={[styles.dateButtonText, { color: colors.text }]}>
                            {formatDate(endDate)} at {formatTime(endDate)}
                        </Text>
                        <ChevronDown size={20} color={colors.secondaryText} />
                    </TouchableOpacity>

                    {errors.date && (
                        <Text style={[styles.errorText, { color: colors.danger }]}>{errors.date}</Text>
                    )}

                    {(Platform.OS === 'ios' || showStartPicker) && (
                        <DateTimePicker
                            textColor='#fff'
                            value={startDate}
                            mode="datetime"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowStartPicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setStartDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    {(Platform.OS === 'ios' || showEndPicker) && (
                        <DateTimePicker
                            textColor='#fff'
                            value={endDate}
                            mode="datetime"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowEndPicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setEndDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>

                {/* Only show location for warehouse and appointments (warehouse-event) */}
                {(eventType === 'warehouse' || eventType === 'appointment') && (
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
                        <View style={[styles.locationInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <MapPin size={20} color={colors.secondaryText} />
                            <TextInput
                                style={[styles.input, styles.locationTextInput, { color: colors.text }]}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Enter location"
                                placeholderTextColor={colors.secondaryText}
                            />
                        </View>
                        {errors.location && (
                            <Text style={[styles.errorText, { color: colors.danger }]}>{errors.location}</Text>
                        )}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }
                        ]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter event description"
                        placeholderTextColor={colors.secondaryText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Showing tasks for all types */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Tasks</Text>
                    {tasks.map((task) => (
                        <View
                            key={task.id}
                            style={[
                                styles.taskItem,
                                { backgroundColor: colors.card, borderColor: colors.border }
                            ]}
                        >
                            <Text style={[styles.taskText, { color: colors.text }]}>
                                {task.name}
                            </Text>
                            <TouchableOpacity
                                style={styles.removeTaskButton}
                                onPress={() => removeTask(task.id)}>
                                <Minus size={20} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={styles.addTaskContainer}>
                        <TouchableOpacity
                            style={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setShowTaskPicker(true)}
                        >
                            <Text style={[styles.dropdownText, { color: selectedTaskId ? colors.text : colors.secondaryText }]}>
                                {selectedTaskId ? PREDEFINED_TASKS.find(task => task.id === selectedTaskId)?.name : 'Select a task'}
                            </Text>
                            <ChevronDown size={20} color={colors.secondaryText} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addTaskButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={addTask}
                            disabled={!selectedTaskId}>
                            <Plus size={20} color={!selectedTaskId ? colors.border : colors.primary} />
                        </TouchableOpacity>

                        <Modal
                            visible={showTaskPicker}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowTaskPicker(false)}
                        >
                            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Task</Text>
                                        <TouchableOpacity onPress={() => setShowTaskPicker(false)}>
                                            <Text style={[styles.modalClose, { color: colors.primary }]}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={PREDEFINED_TASKS}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.modalItem,
                                                    {
                                                        backgroundColor: selectedTaskId === item.id ? colors.primary : 'transparent',
                                                        opacity: tasks.some(t => t.id === item.id) ? 0.5 : 1
                                                    }
                                                ]}
                                                onPress={() => {
                                                    if (!tasks.some(t => t.id === item.id)) {
                                                        setSelectedTaskId(item.id);
                                                    }
                                                }}
                                                disabled={tasks.some(t => t.id === item.id)}
                                            >
                                                <Text style={[
                                                    styles.modalItemText,
                                                    {
                                                        color: selectedTaskId === item.id ? '#FFFFFF' : colors.text,
                                                        opacity: tasks.some(t => t.id === item.id) ? 0.5 : 1
                                                    }
                                                ]}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>

                {/* Show priority for all types */}
                {/* <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
                    <View style={styles.priorityButtons}>
                        <TouchableOpacity
                            style={[
                                styles.priorityButton,
                                {
                                    backgroundColor: priority === 'low' ? colors.lowPriorityBg : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setPriority('low')}>
                            <Text
                                style={[
                                    styles.priorityButtonText,
                                    { color: priority === 'low' ? colors.lowPriorityText : colors.secondaryText }
                                ]}>
                                Low
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.priorityButton,
                                {
                                    backgroundColor: priority === 'medium' ? colors.mediumPriorityBg : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setPriority('medium')}>
                            <Text
                                style={[
                                    styles.priorityButtonText,
                                    { color: priority === 'medium' ? colors.mediumPriorityText : colors.secondaryText }
                                ]}>
                                Medium
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.priorityButton,
                                {
                                    backgroundColor: priority === 'high' ? colors.highPriorityBg : colors.inputBackground,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setPriority('high')}>
                            <Text
                                style={[
                                    styles.priorityButtonText,
                                    { color: priority === 'high' ? colors.highPriorityText : colors.secondaryText }
                                ]}>
                                High
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                {/* </View> */}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: '#1B1916', borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                    onPress={() => router.back()}>
                    <Text style={[styles.cancelButtonText, { color: '#FFFFFF' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.saveButton,
                        { backgroundColor: colors.primary },
                        isLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isLoading}>
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Saving...' : 'Save Event'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Add new styles for the type selection buttons
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 16,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    locationTextInput: {
        flex: 1,
        borderWidth: 0,
        padding: 12,
    },
    textArea: {
        height: 120,
        paddingTop: 12,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    dateButtonText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    errorText: {
        marginTop: 4,
        fontSize: 14,
    },
    priorityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    priorityButtonText: {
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        marginRight: 8,
    },
    saveButton: {
        marginLeft: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        padding: 12,
        borderRadius: 8,
    },
    taskText: {
        flex: 1,
        fontSize: 16,
    },
    removeTaskButton: {
        padding: 8,
    },
    addTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addTaskInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginRight: 8,
    },
    addTaskButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Add type button styles
    typeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    typeButtonText: {
        fontWeight: '600',
    },
    predefinedTaskItem: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    predefinedTaskContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
    },
    predefinedTaskText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dropdownContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 8,
        paddingHorizontal: 12,
        height: 50,
    },
    dropdownText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    modalClose: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    modalItemText: {
        fontSize: 16,
    },
});