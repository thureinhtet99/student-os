import { View, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Avatar } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Teacher } from '@/services/teacher-service';
import { ROUTES } from '@/constants/routes';

interface TeacherListItemProps {
  teacher: Teacher;
}

export function TeacherListItem({ teacher }: TeacherListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(ROUTES.TEACHERS_DETAIL(teacher.id) as Href);
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center p-4 bg-card rounded-lg shadow-sm mb-3">
      <Avatar src={teacher.avatar} size={50} className="mr-3" />
      <View className="flex-1">
        <Text className="text-lg font-bold text-card-foreground">{`${teacher.firstName} ${teacher.lastName}`}</Text>
        <Text className="text-sm text-muted-foreground">{`ID: ${teacher.employeeId}`}</Text>
        <Text className="text-sm text-muted-foreground">{`${teacher.department}`}</Text>
      </View>
    </TouchableOpacity>
  );
}
