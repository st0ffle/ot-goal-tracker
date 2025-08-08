import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PatientCardActions({ patientId }: { patientId: string }) {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link href={`/patient/${patientId}`} prefetch={true}>
          Voir
        </Link>
      </Button>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link href={`/patient/create-goal?patientId=${patientId}`} prefetch={true}>
          Ajouter Objectif
        </Link>
      </Button>
    </div>
  )
}