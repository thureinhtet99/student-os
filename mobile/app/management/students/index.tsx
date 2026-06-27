import { StudentList } from '@/features/students/components/StudentList';
import { ScreenWrapper } from '@/components/shared/screen-wrapper';

export default function StudentsScreen() {
  return (
    <ScreenWrapper title="Students">
      <StudentList />
    </ScreenWrapper>
  );
}
