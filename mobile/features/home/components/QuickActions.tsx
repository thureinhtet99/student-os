import { View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Text } from '@/components/ui/text';
import { ROUTES } from '@/constants/routes';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 4;
const PADDING = 24;
const GRID_GAP = 16;
const CARD_SIZE = (width - PADDING * 2 - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;


const QUICK_ACTIONS = [
  { label: 'Students', icon: 'team', route: ROUTES.STUDENTS },
  { label: 'Teachers', icon: 'idcard', route: ROUTES.TEACHERS },
  { label: 'Classes', icon: 'book', route: ROUTES.CLASSES },
  { label: 'Subjects', icon: 'filetext1', route: ROUTES.SUBJECTS },
  { label: 'Attendance', icon: 'calendar', route: ROUTES.ATTENDANCE },
  { label: 'Timetable', icon: 'table', route: ROUTES.TIMETABLE },
  { label: 'Exams', icon: 'form', route: ROUTES.EXAMS },
  { label: 'Results', icon: 'profile', route: ROUTES.RESULTS },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View>
      <Text variant="h3" className="px-6 pt-4 pb-2">Management</Text>
      <View className="flex-row flex-wrap justify-between px-6 pt-2">
        {QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.label}
            className="items-center justify-start mb-4"
            style={{ width: CARD_SIZE }}
            onPress={() => router.push(item.route as Href)}
          >
            <View className="bg-muted items-center justify-center rounded-full mb-2" style={{width: CARD_SIZE * 0.8, height: CARD_SIZE * 0.8}}>
                <AntDesign name={item.icon as any} size={24} color="#002D56" />
            </View>
            <Text className="text-center text-xs font-medium">{item.label}</Text>
          </TouchableOpacity>
        ))}
         {/* Fillers for alignment */}
         {[
            ...Array((COLUMN_COUNT - (QUICK_ACTIONS.length % COLUMN_COUNT)) % COLUMN_COUNT),
          ].map((_, i) => (
            <View key={`filler-${i}`} style={{ width: CARD_SIZE }} />
          ))}
      </View>
    </View>
  );
}