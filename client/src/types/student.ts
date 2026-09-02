export interface Student {
  id: string
  grNumber: string
  class: string
  sessionYear: string
  admissionDate: string
  status: "Active" | "Inactive"
  firstName: string
  lastName: string
  name: string // Display Name (First Name + Last Name)
  dob: string
  gender: "Male" | "Female"
  mobile: string
  currentAddress: string
  permanentAddress: string
  bloodGroup: string
  emergencyContact: string
  guardianEmail: string
  guardianFirstName: string
  guardianLastName: string
  guardianMobile: string
  guardianGender: "Male" | "Female"
}
