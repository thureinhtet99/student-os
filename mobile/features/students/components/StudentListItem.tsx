import { View, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Avatar } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Student } from '@/services/student-service';
import { ROUTES } from '@/constants/routes';

interface StudentListItemProps {
  student: Student;
}

export function StudentListItem({ student }: StudentListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(ROUTES.STUDENTS_DETAIL(student.id) as Href);
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center p-4 bg-card rounded-lg shadow-sm mb-3">
      <Avatar src={student.avatar} size={50} className="mr-3" />
      <View className="flex-1">
        <Text className="text-lg font-bold text-card-foreground">{`${student.firstName} ${student.lastName}`}</Text>
        <Text className="text-sm text-muted-foreground">{`ID: ${student.studentId}`}</Text>
        <Text className="text-sm text-muted-foreground">{`${student.grade} • ${student.class}`}</Text>
      </View>
    </TouchableOpacity>
  );
}
