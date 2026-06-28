import { ScrollView, View } from "react-native";
import { Header } from "@/components/shared/header";
import { Text } from "@/components/ui/text";
import { GridItem } from "@/features/home/components/grid-item";
import { ROUTES } from "@/constants/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Index() {
  const mockUser = {
    avatar: "https://api.dicebear.com/7.x/initials/png?seed=John%20Doe",
    fullName: "FIRSTNAME LASTNAME SURNAME",
    studentId: "1234567890",
    grade: "A",
    className: "AI-ML",
  };

  const studentDetails = {
    branch: "AI-ML",
    sem: "5",
    division: "5AI-ML24_202324",
    rollNo: "44",
    batch: "2",
  };

  const gridItems: {
    label: string;
    iconName: string;
    route: string;
  }[] = [
    { label: "Today's Lecture", iconName: "book", route: ROUTES.ACADEMIC },
    {
      label: "Attendance Inc.",
      iconName: "check-square",
      route: ROUTES.ATTENDANCE,
    },
    { label: "Syllabus", iconName: "file-text", route: ROUTES.ACADEMIC },
    { label: "Time table", iconName: "calendar", route: ROUTES.TIMETABLE },
    { label: "Faculties", iconName: "team", route: ROUTES.TEACHERS },
    { label: "Exams", iconName: "form", route: ROUTES.EXAMS },
    { label: "Results", iconName: "profile", route: ROUTES.RESULTS },
    { label: "Fees", iconName: "credit-card", route: ROUTES.FEES },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="bg-primary rounded-none">
            <View className="flex-1">
              <Header user={mockUser} />
            </View>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance p-4">
            <View className="flex-row flex-wrap justify-around items-center bg-primary">
              <View className="w-1/2 mb-2">
                <Text className="text-xs text-muted-foreground">Branch</Text>
                <Text className="font-medium text-foreground">
                  {studentDetails.branch}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-xs text-muted-foreground">Sem</Text>
                <Text className="font-medium text-foreground">
                  {studentDetails.sem}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-xs text-muted-foreground">Division</Text>
                <Text className="font-medium text-foreground">
                  {studentDetails.division}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-xs text-muted-foreground">Roll No.</Text>
                <Text className="font-medium text-foreground">
                  {studentDetails.rollNo}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-xs text-muted-foreground">Batch</Text>
                <Text className="font-medium text-foreground">
                  {studentDetails.batch}
                </Text>
              </View>
            </View>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Grid of Features */}
      <View className="flex-row flex-wrap gap-4 p-2">
        {gridItems.map((item, index) => (
          <View key={index} className="w-1/3">
            <GridItem {...item} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
