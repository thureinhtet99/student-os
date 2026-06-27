import { StudentDetail } from '@/features/students/components/StudentDetail';
import { ScreenWrapper } from '@/components/shared/screen-wrapper';

export default function StudentDetailScreen() {
  return (
    <ScreenWrapper title="Student Details">
      <StudentDetail />
    </ScreenWrapper>
  );
}
