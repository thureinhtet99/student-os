/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { FormCombobox } from "@/components/ui/combobox-basic"
import type { Student } from "../../types/student"

const classItems = ["Grade-1", "Grade-2", "Grade-3", "Grade-4", "Grade-5", "Grade-6", "Grade-7", "Grade-8", "Grade-9", "Grade-10", "Grade-11", "Grade-12"]
const sessionItems = ["2024-2025", "2025-2026", "2026-2027"]
const bloodGroupItems = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

interface StudentFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (student: Omit<Student, "id"> & { id?: string }) => void
  editingStudent: Student | null
}

const defaultFormState = (): Omit<Student, "id"> => ({
  grNumber: `GR-${Date.now().toString().slice(-6)}`,
  class: "",
  sessionYear: "2025-2026",
  admissionDate: new Date().toISOString().split('T')[0],
  status: "Active",
  firstName: "",
  lastName: "",
  dob: "",
  gender: "Male",
  mobile: "",
  currentAddress: "",
  permanentAddress: "",
  bloodGroup: "",
  emergencyContact: "",
  guardianEmail: "",
  guardianFirstName: "",
  guardianLastName: "",
  guardianMobile: "",
  guardianGender: "Male",
  name: ""
})

export function StudentFormDrawer({ open, onOpenChange, onSubmit, editingStudent }: StudentFormDrawerProps) {
  const [formData, setFormData] = React.useState<Omit<Student, "id">>(defaultFormState())
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  React.useEffect(() => {
    if (editingStudent) {
      setFormData({ ...editingStudent })
    } else {
      setFormData(defaultFormState())
    }
    setIsSubmitted(false)
  }, [editingStudent, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Required valid checking
    if (!formData.firstName.trim() || !formData.class.trim() || !formData.dob.trim()) return

    onSubmit(editingStudent ? { ...formData, id: editingStudent.id } : formData)
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="fixed top-0 right-0 bottom-0 z-50 flex h-full w-full max-w-4xl flex-col bg-card p-6 shadow-2xl border-l border-border outline-none animate-in slide-in-from-right duration-200">
        <DrawerHeader className="p-0 mb-4">
          <DrawerTitle className="text-lg font-semibold">{editingStudent ? "Edit Student Info" : "Create Student"}</DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground mt-0.5">Please fill student and guardian comprehensive profiles.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1 text-sm">
          {/* Section 1: Academic Basics */}
          <div className="bg-muted/20 p-4 rounded-xl border border-dashed flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Gr Number" required isSubmitted={isSubmitted} value={formData.grNumber} readOnly />
              <FormCombobox label="Class Section" required isSubmitted={isSubmitted} value={formData.class} items={classItems} placeholder="Select Class" onValueChange={(val) => setFormData({ ...formData, class: val })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormCombobox label="Session Year" required isSubmitted={isSubmitted} value={formData.sessionYear} items={sessionItems} placeholder="Select Year" onValueChange={(val) => setFormData({ ...formData, sessionYear: val })} />
              <FormField label="Admission Date" type="date" required isSubmitted={isSubmitted} value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} />
            </div>
            
            {/* Status Radio Group */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/80">Status *</label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 text-xs font-normal cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === "Active"} onChange={() => setFormData({ ...formData, status: "Active" })} className="accent-primary" /> Active
                </label>
                <label className="flex items-center gap-2 text-xs font-normal cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === "Inactive"} onChange={() => setFormData({ ...formData, status: "Inactive" })} className="accent-primary" /> Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Student Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required isSubmitted={isSubmitted} value={formData.firstName} placeholder="First name" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <FormField label="Last Name" required isSubmitted={isSubmitted} value={formData.lastName} placeholder="Last name" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date of Birth" type="date" required isSubmitted={isSubmitted} value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
            <FormField label="Mobile Number" type="tel" isSubmitted={isSubmitted} value={formData.mobile} placeholder="Mobile" onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/80">Gender *</label>
            <div className="flex items-center gap-4 mt-1">
              {["Male", "Female"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-xs font-normal cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={formData.gender === g} 
                    onChange={() => setFormData({ ...formData, gender: g as "Male" | "Female" })} 
                    className="accent-primary" 
                  /> 
                  {g}
                </label>
              ))}
            </div>
          </div>

          <FormField label="Current Address" isSubmitted={isSubmitted} value={formData.currentAddress} placeholder="Current address" onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })} />
          <FormField label="Permanent Address" isSubmitted={isSubmitted} value={formData.permanentAddress} placeholder="Permanent address" onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })} />

          <div className="grid grid-cols-2 gap-4">
            <FormCombobox label="Blood Group" isSubmitted={isSubmitted} value={formData.bloodGroup} items={bloodGroupItems} placeholder="Select Blood group" onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })} />
            <FormField label="Emergency Contact" isSubmitted={isSubmitted} value={formData.emergencyContact} placeholder="Emergency contact phone" onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} />
          </div>

          {/* Section 3: Guardian Details */}
          <div className="border-t pt-4 mt-2">
            <h3 className="text-xs font-bold text-foreground/80 mb-3 tracking-wide uppercase">Guardian Information</h3>
            <div className="flex flex-col gap-4">
              <FormField label="Guardian Email" type="email" required isSubmitted={isSubmitted} value={formData.guardianEmail} placeholder="Search or Enter Guardian Email" onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Guardian First Name" required isSubmitted={isSubmitted} value={formData.guardianFirstName} placeholder="Guardian first name" onChange={(e) => setFormData({ ...formData, guardianFirstName: e.target.value })} />
                <FormField label="Guardian Last Name" required isSubmitted={isSubmitted} value={formData.guardianLastName} placeholder="Guardian last name" onChange={(e) => setFormData({ ...formData, guardianLastName: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  label="Guardian Mobile" 
                  required 
                  isSubmitted={isSubmitted} 
                  value={formData.guardianMobile} 
                  placeholder="Guardian mobile phone" 
                  onChange={(e) => setFormData({ ...formData, guardianMobile: e.target.value })} 
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground/80">Guardian Gender *</label>
                  <div className="flex items-center gap-4 mt-2">
                    {["Male", "Female"].map((g) => (
                      <label key={g} className="flex items-center gap-2 text-xs font-normal cursor-pointer">
                        <input 
                          type="radio" 
                          name="guardianGender" 
                          checked={formData.guardianGender === g} 

                          onChange={() => setFormData({ ...formData, guardianGender: g as "Male" | "Female" })} 
                          className="accent-primary" 
                        /> 
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save Actions */}
          <DrawerFooter className="mt-auto p-0 pt-4 border-t flex flex-row justify-end gap-2 shrink-0">
            <DrawerClose render={<Button variant="outline" type="button" size="sm" className="cursor-pointer" />}>Cancel</DrawerClose>
            <Button type="submit" size="sm" className="cursor-pointer">Submit</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}