import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// ... other imports

export function SubjectListItem({ subject }: SubjectListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(ROUTES.ACADEMIC_DETAIL(subject.id) as Href);
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center p-4 bg-card rounded-lg shadow-sm mb-3">
      <Avatar alt={subject.name} size={50} className="mr-3">
        <AvatarImage source={{ uri: `https://api.dicebear.com/7.x/initials/png?seed=${subject.name}` }} />
        <AvatarFallback>
          <Text>{subject.name.substring(0, 2).toUpperCase()}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1">
        <Text className="text-lg font-bold text-card-foreground">{subject.name}</Text>
        <Text className="text-sm text-muted-foreground">{`Code: ${subject.code}`}</Text>
        <Text className="text-sm text-muted-foreground">{`Teacher: ${subject.teacher}`}</Text>
        <Text className="text-sm text-muted-foreground">{`Credits: ${subject.credits}`}</Text>
      </View>
    </TouchableOpacity>
  );
}
