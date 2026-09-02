import * as React from "react"

export function TeachersContent() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teachers Directory</h1>
        <p className="text-muted-foreground">ဆရာ/ဆရာမများ၏ ကိုယ်ရေးမှတ်တမ်းနှင့် အချက်အလက်များ</p>
      </div>
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        ဆရာ/မ များဆိုင်ရာ Component လက်ရှိ ရောက်ရှိနေပါသည်။
      </div>
    </div>
  )
}