import { DiagnosticoWizard } from "@/components/diagnostico/wizard"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function DiagnosticoPage({ params }: PageProps) {
  const { token } = await params
  
  return <DiagnosticoWizard token={token} />
}
