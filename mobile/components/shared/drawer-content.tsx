import { View, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, Href } from 'expo-router';
import { Text } from '@/components/ui/text';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { ROUTES } from '@/constants/routes';

const DRAWER_ITEMS = [
    { label: 'Home', icon: 'home', route: ROUTES.HOME },
    { label: 'Attendance', icon: 'checksquareo', route: ROUTES.ATTENDANCE },
    { label: 'Home work', icon: 'book', route: '/homework' }, // Placeholder
    { label: 'Profile', icon: 'user', route: ROUTES.PROFILE },
    { label: 'Exam', icon: 'form', route: ROUTES.EXAMS },
    { label: 'Fee', icon: 'creditcard', route: '/fee' }, // Placeholder
    { label: 'Time table', icon: 'table', route: ROUTES.TIMETABLE },
    { label: 'Library', icon: 'book', route: '/library' }, // Placeholder
    { label: 'Downloads', icon: 'download', route: '/downloads' }, // Placeholder
    { label: 'Track Bus', icon: 'car', route: '/track-bus' }, // Placeholder
    { label: 'Apply Leave', icon: 'calendar', route: '/apply-leave' }, // Placeholder
    { label: 'Activity', icon: 'rocket1', route: '/activity' }, // Placeholder
    { label: 'Notification', icon: 'bells', route: '/notifications' }, // Placeholder
]

export function DrawerContent(props: any) {
    const router = useRouter();

    return (
        <DrawerContentScrollView {...props} className="bg-white">
            <View className="p-6 bg-primary">
                <Text variant="h3" className="text-white">School App</Text>
            </View>
            <View className="pt-4">
            {DRAWER_ITEMS.map(item => (
                <TouchableOpacity 
                    key={item.label} 
                    onPress={() => router.push(item.route as Href)} 
                    className="flex-row items-center px-6 py-3"
                >
                    <AntDesign name={item.icon as any} size={22} color="black" />
                    <Text className="ml-5 text-base font-medium">{item.label}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </DrawerContentScrollView>
    );
}
