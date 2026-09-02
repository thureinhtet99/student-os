import * as React from "react"
import type { Student } from "../../types/student"
import { StudentsListTable } from "./students-list-table"
import { StudentFormDrawer } from "./student-form-drawer"
import { Button } from "@/components/ui/button"
import { AlertBanner } from "@/components/ui/alert-baner"
import { PlusIcon, Loader2Icon, Trash2Icon, AlertTriangleIcon } from "lucide-react"

const demoStudents: Student[] = [
  {
    id: "1",
    grNumber: "GR-202401",
    class: "Grade-10",
    sessionYear: "2024-2025",
    admissionDate: "2024-05-10",
    status: "Active",
    firstName: "Kyaw",
    lastName: "Zin",
    name: "Kyaw Zin",
    dob: "2009-03-12",
    gender: "Male",
    mobile: "0912345678",
    currentAddress: "Ygn",
    permanentAddress: "Ygn",
    bloodGroup: "O+",
    emergencyContact: "091111111",
    guardianEmail: "parent1@gmail.com",
    guardianFirstName: "U",
    guardianLastName: "Ba",
    guardianMobile: "091111111",
    guardianGender: "Male"
  },
  {
    id: "1",
    grNumber: "GR-202401",
    class: "Grade-10",
    sessionYear: "2024-2025",
    admissionDate: "2024-05-10",
    status: "Active",
    firstName: "Kyaw",
    lastName: "Zin",
    name: "Kyaw Zin",
    dob: "2009-03-12",
    gender: "Male",
    mobile: "0912345678",
    currentAddress: "Ygn",
    permanentAddress: "Ygn",
    bloodGroup: "O+",
    emergencyContact: "091111111",
    guardianEmail: "parent1@gmail.com",
    guardianFirstName: "U",
    guardianLastName: "Ba",
    guardianMobile: "091111111",
    guardianGender: "Male"
  },
  {
    id: "1",
    grNumber: "GR-202401",
    class: "Grade-10",
    sessionYear: "2024-2025",
    admissionDate: "2024-05-10",
    status: "Active",
    firstName: "Kyaw",
    lastName: "Zin",
    name: "Kyaw Zin",
    dob: "2009-03-12",
    gender: "Male",
    mobile: "0912345678",
    currentAddress: "Ygn",
    permanentAddress: "Ygn",
    bloodGroup: "O+",
    emergencyContact: "091111111",
    guardianEmail: "parent1@gmail.com",
    guardianFirstName: "U",
    guardianLastName: "Ba",
    guardianMobile: "091111111",
    guardianGender: "Male"
  },
];
export function StudentsScreen() {
  const [students, setStudents] = React.useState<Student[]>(demoStudents)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [showSuccessBanner, setShowSuccessBanner] = React.useState(false)

  const handleFormSubmit = async (data: Omit<Student, "id"> & { id?: string }) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    
    if (data.id) {
      setStudents(students.map(s => s.id === data.id ? (data as Student) : s))
    } else {
      setStudents([...students, { ...data, id: crypto.randomUUID() }])
    }
    setIsLoading(false)
    setEditingStudent(null)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleteConfirmOpen(false)
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStudents(students.filter(s => s.id !== deleteId))
    setDeleteId(null)
    setIsLoading(false)
    setShowSuccessBanner(true)
  }

  return (
    <div className="relative flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6 min-h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs rounded-xl">
          <div className="flex flex-col items-center gap-2 bg-card p-4 rounded-xl border shadow-lg">
            <Loader2Icon className="size-6 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Processing...</span>
          </div>
        </div>
      )}

      <AlertBanner show={showSuccessBanner} title="Delete Successful!" description="ကျောင်းသားအချက်အလက်ကို အောင်မြင်စွာ ဖျက်ဆီးပြီးပါပြီ။" onClose={() => setShowSuccessBanner(false)} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Students Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and filter student layouts smoothly.</p>
        </div>
        <Button size="sm" onClick={() => { setEditingStudent(null); setDrawerOpen(true); }} className="cursor-pointer">
          <PlusIcon className="size-4" /> Add Student
        </Button>
      </div>

      <StudentsListTable students={students} onEdit={(s) => { setEditingStudent(s); setDrawerOpen(true); }} onDelete={(id) => { setDeleteId(id); setDeleteConfirmOpen(true); }} />
      <StudentFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSubmit={handleFormSubmit} editingStudent={editingStudent} />

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border bg-card p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"><AlertTriangleIcon className="size-5" /></div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground leading-none">Are you absolutely sure?</h3>
                <p className="text-xs text-muted-foreground mt-2">ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍ရမည်မဟုတ်ပါ။</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
              <Button size="sm" variant="destructive" onClick={confirmDelete} className="gap-1.5"><Trash2Icon className="size-3.5" /> Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}