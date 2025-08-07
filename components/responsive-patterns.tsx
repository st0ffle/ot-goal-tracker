"use client"

import { ReactNode } from 'react'

interface ResponsivePatternProps {
  children: ReactNode
}

// Pattern 1: Grid responsive
export function ResponsiveGrid({ children }: ResponsivePatternProps) {
  return (
    <div className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    ">
      {children}
    </div>
  )
}

// Pattern 2: Container responsive
export function ResponsiveContainer({ children }: ResponsivePatternProps) {
  return (
    <div className="
      w-full
      max-w-7xl
      mx-auto
      px-4 sm:px-6 lg:px-8
    ">
      {children}
    </div>
  )
}

// Pattern 3: Text responsive
export function ResponsiveHeading({ children }: ResponsivePatternProps) {
  return (
    <h1 className="
      text-2xl sm:text-3xl lg:text-4xl
      font-bold
      tracking-tight
    ">
      {children}
    </h1>
  )
}

// Pattern 4: Stack responsive
export function ResponsiveStack({ children }: ResponsivePatternProps) {
  return (
    <div className="
      flex
      flex-col sm:flex-row
      gap-4
      items-start sm:items-center
    ">
      {children}
    </div>
  )
}

// Pattern 5: Responsive Table (Table on desktop, Cards on mobile)
interface ResponsiveTableProps {
  headers: string[]
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ headers, children, className }: ResponsiveTableProps) {
  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="text-left p-4 font-medium text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {children}
      </div>
    </div>
  )
}