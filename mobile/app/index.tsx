import { ScreenWrapper } from "@/components/shared/screen-wrapper";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/constants/theme";
import { AntDesign } from "@react-native-vector-icons/ant-design";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const GRID_GAP = 12;
const CARD_SIZE = (width - 48 - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface DashboardItem {
  id: string;
  label: string;
  icon: string;
}

const DASHBOARD_ITEMS: DashboardItem[] = [
  { id: "lecture", label: "Today's Lecture", icon: "easel-outline" },
  { id: "attendance_inc", label: "Attendance Inc.", icon: "people-outline" },
  { id: "syllabus", label: "Syllabus", icon: "document-text-outline" },
  { id: "timetable", label: "Time table", icon: "calendar-outline" },
  { id: "faculties", label: "Faculties", icon: "person-outline" },
  { id: "exams", label: "Exams", icon: "school-outline" },
  { id: "results", label: "Results", icon: "ribbon-outline" },
  { id: "fees", label: "Fees", icon: "wallet-outline" },
  { id: "attendance", label: "Attendance", icon: "checkmark-circle-outline" },
  { id: "request", label: "Attend. request", icon: "time-outline" },
  { id: "icard", label: "Download I-Card", icon: "id-card-outline" },
];

export default function Dashboard() {
  return (
    <ScreenWrapper bg={COLORS.background}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 40,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Avatar size={48} />
            <Text variant="h3" color={COLORS.text.light}>
              Campus name
            </Text>
            <TouchableOpacity>
              <AntDesign
                name="notification"
                size={24}
                color={COLORS.text.light}
              />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text variant="h1" color={COLORS.text.light} className="uppercase">
              Firstname Lastname Surname
            </Text>
            <Text
              variant="caption"
              color={COLORS.text.light}
              className="opacity-70"
            >
              1234567890 | 190303106080@university.ac.in
            </Text>
          </View>

          <View className="flex-row justify-between pt-4 border-t border-white/20">
            <InfoItem label="Branch" value="AI-ML" />
            <InfoItem label="Sem" value="5" />
            <InfoItem label="Division" value="5AI-ML24" subValue="_202324" />
            <InfoItem label="Roll No." value="44" />
            <InfoItem label="Batch" value="2" />
          </View>
        </View>

        {/* Grid Section */}
        <View className="flex-row flex-wrap justify-between p-6">
          {DASHBOARD_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                width: CARD_SIZE,
                height: CARD_SIZE + 10,
                backgroundColor: COLORS.card,
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="mb-2">
                <AntDesign
                  name={item.icon as any}
                  size={32}
                  color={COLORS.primary}
                />
              </View>
              <Text
                variant="caption"
                style={{ textAlign: "center", fontSize: 10, fontWeight: "500" }}
                color={COLORS.primary}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Fillers for alignment */}
          {[
            ...Array(COLUMN_COUNT - (DASHBOARD_ITEMS.length % COLUMN_COUNT)),
          ].map((_, i) => (
            <View key={`filler-${i}`} style={{ width: CARD_SIZE }} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function InfoItem({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <View className="items-center">
      <Text
        variant="caption"
        color={COLORS.text.light}
        className="opacity-60 mb-1"
      >
        {label}
      </Text>
      <Text
        style={{ fontSize: 13, fontWeight: "bold" }}
        color={COLORS.text.light}
      >
        {value}
      </Text>
      {subValue && (
        <Text style={{ fontSize: 10 }} color={COLORS.text.light}>
          {subValue}
        </Text>
      )}
    </View>
  );
}
