import { TeacherList } from '@/features/teachers/components/TeacherList';
import { ScreenWrapper } from '@/components/shared/screen-wrapper';

export default function TeachersScreen() {
  return (
    <ScreenWrapper title="Teachers">
      <TeacherList />
    </ScreenWrapper>
  );
}
