import * as React from "react"

export function StudentsContent() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students Management</h1>
        <p className="text-muted-foreground">ကျောင်းသား/သူ စာရင်းများနှင့် အချက်အလက်များ မန်နေဂျာ</p>
      </div>
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        
        ကျောင်းသားများဆိုင်ရာ Component လက်ရှိ ရောက်ရှိနေပါသည်။
      </div>
    </div>
  )
}