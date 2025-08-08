import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PatientCardActions } from '@/components/client/patient-card-actions'

interface Patient {
  id: string
  name: string
  age: number
  points: number
}

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{patient.name}</h3>
            <p className="text-gray-600">{patient.age} ans</p>
          </div>
          <Badge>{patient.points} pts</Badge>
        </div>
        <PatientCardActions patientId={patient.id} />
      </CardContent>
    </Card>
  )
}