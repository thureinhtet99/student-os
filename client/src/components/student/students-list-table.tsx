/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"
import type { Student } from "../../types/student"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBox } from "@/components/ui/search-box" // Reusable SearchBox ကို Import ယူသည်
import { Edit3Icon, Trash2Icon, Columns3Icon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StudentsListTableProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
}

const ITEMS_PER_PAGE = 5

export function StudentsListTable({ students, onEdit, onDelete }: StudentsListTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("") // Search State
  const [currentPage, setCurrentPage] = React.useState(1)
  const [columnVisibility, setColumnVisibility] = React.useState({
    grNumber: true,
    name: true,
    class: true,
    sessionYear: true,
    admissionDate: true,
    gender: true,
    status: true,
  })

  // Search စာသားရိုက်လိုက်တိုင်း ပထမဆုံး စာမျက်နှာ (Page 1) သို့ အလိုအလျောက် ပြန်ပို့ပေးသည်
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const toggleColumn = (key: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // ၁။ ရိုက်လိုက်သည့် စာလုံးပေါ်မူတည်ပြီး ကျောင်းသားစာရင်းကို စစ်ထုတ်ခြင်း (Search Logic)
  const filteredStudents = React.useMemo(() => {
    if (!searchQuery.trim()) return students
    
    const query = searchQuery.toLowerCase().trim()
    return students.filter((student) => {
      return (
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.grNumber.toLowerCase().includes(query)
      )
    })
  }, [students, searchQuery])

  // ၂။ စစ်ထုတ်ပြီးသား စာရင်းပေါ်မူတည်ပြီး Pagination တွက်ချက်ခြင်း
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredStudents.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col gap-4">
      {/* ဩဘာစရာ ကောင်းသော အပိုင်း- Search Box နှင့် Column Dropdown ကို တစ်တန်းတည်း ညှိထားပါသည် */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
        <SearchBox 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search by name or GR number..." 
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 rounded-lg text-xs px-3 font-medium cursor-pointer transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0">
            <Columns3Icon className="size-3.5" />
            Columns
            <ChevronDownIcon className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {Object.keys(columnVisibility).map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={columnVisibility[col as keyof typeof columnVisibility]}
                onCheckedChange={() => toggleColumn(col as keyof typeof columnVisibility)}
                className="capitalize"
              >
                {col.replace(/([A-Z])/g, " $1")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table စာရင်းပိုင်း (currentItems ကို သုံးထားပါသည်) */}
      <div className="w-full rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columnVisibility.grNumber && <TableHead className="p-4">GR Number</TableHead>}
              {columnVisibility.name && <TableHead className="p-4">Student Name</TableHead>}
              {columnVisibility.class && <TableHead className="p-4">Class</TableHead>}
              {columnVisibility.sessionYear && <TableHead className="p-4 hidden md:table-cell">Session Year</TableHead>}
              {columnVisibility.admissionDate && <TableHead className="p-4 hidden md:table-cell">Admission</TableHead>}
              {columnVisibility.gender && <TableHead className="p-4 hidden sm:table-cell">Gender</TableHead>}
              {columnVisibility.status && <TableHead className="p-4">Status</TableHead>}
              <TableHead className="p-4 text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="p-12 text-center text-muted-foreground">
                  No matching student records found!
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((student) => (
                <TableRow key={student.id}>
                  {columnVisibility.grNumber && (
                    <TableCell className="p-4 font-mono font-semibold text-foreground/80">
                      {student.grNumber}
                    </TableCell>
                  )}
                  
                  {columnVisibility.name && (
                    <TableCell className="p-4">
                      <div className="font-medium text-foreground">{student.firstName} {student.lastName}</div>
                      <div className="text-xs text-muted-foreground">{student.mobile || "-"}</div>
                    </TableCell>
                  )}
                  
                  {columnVisibility.class && (
                    <TableCell className="p-4 text-muted-foreground">{student.class}</TableCell>
                  )}
                  
                  {columnVisibility.sessionYear && (
                    <TableCell className="p-4 hidden md:table-cell tabular-nums text-muted-foreground">
                      {student.sessionYear}
                    </TableCell>
                  )}
                  
                  {columnVisibility.admissionDate && (
                    <TableCell className="p-4 hidden md:table-cell tabular-nums text-muted-foreground">
                      {student.admissionDate}
                    </TableCell>
                  )}
                  
                  {columnVisibility.gender && (
                    <TableCell className="p-4 hidden sm:table-cell">
                      <Badge variant="outline">{student.gender}</Badge>
                    </TableCell>
                  )}

                  {columnVisibility.status && (
                    <TableCell className="p-4">
                      <Badge variant={student.status === "Active" ? "default" : "destructive"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                  )}
                  
                  <TableCell className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => onEdit(student)}>
                        <Edit3Icon className="size-3.5" />
                      </Button>
                      <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => onDelete(student.id)}>
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI အပိုင်း */}
      {filteredStudents.length > 0 && (
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-xs text-muted-foreground">
            Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, filteredStudents.length)}</b> of <b>{filteredStudents.length}</b> students
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <div className="text-xs font-medium text-foreground px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}