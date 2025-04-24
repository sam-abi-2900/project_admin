import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

type EnhancedCheckboxProps = {
    checked: boolean;
    onPress: () => void;
    style?: ViewStyle;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
    checked,
    onPress,
    style,
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(
                checked ? '#4169E1' : '#FFFFFF',
                { duration: 150 }
            ),
            transform: [
                {
                    scale: withSpring(checked ? 1 : 0.9, {
                        damping: 15,
                        stiffness: 200,
                    }),
                },
            ],
            borderColor: interpolateColor(
                withTiming(checked ? 1 : 0, { duration: 150 }),
                [0, 1],
                ['#D1D5DB', '#4169E1']
            ),
        };
    });

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            style={[styles.checkbox, animatedStyle, style]}
        >
            {checked && <Check size={16} color="#FFFFFF" />}
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EnhancedCheckbox;