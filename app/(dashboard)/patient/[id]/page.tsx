import type { Metadata } from 'next'
import { PatientDetail } from '@/components/views/patient-detail'
import { mockPatients, mockGoals } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>  // ← Promise en Next.js 15
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  // Pre-render les pages des patients existants
  return mockPatients.map((patient) => ({
    id: patient.id,
  }))
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params
  const patient = mockPatients.find(p => p.id === id)
  
  return {
    title: patient ? `${patient.name} - OT Goal Tracker` : 'Patient',
    description: patient ? `Suivi des objectifs de ${patient.name}` : 'Détails du patient'
  }
}

export default async function PatientDetailPage({ 
  params 
}: PageProps) {
  // IMPORTANT: await params car c'est une Promise en Next.js 15
  const { id } = await params
  
  const patient = mockPatients.find(p => p.id === id)
  
  if (!patient) {
    notFound()
  }
  
  const patientGoals = mockGoals.filter(g => 
    g.patientId === id || 
    mockGoals.find(parent => parent.id === g.parentId)?.patientId === id
  )
  
  return (
    <PatientDetail 
      patient={patient}
      goals={patientGoals}
    />
  )
}