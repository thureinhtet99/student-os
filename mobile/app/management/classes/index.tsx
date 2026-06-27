import { ClassList } from '@/features/classes/components/ClassList';
import { ScreenWrapper } from '@/components/shared/screen-wrapper';

export default function ClassesScreen() {
  return (
    <ScreenWrapper title="Classes">
      <ClassList />
    </ScreenWrapper>
  );
}
