import { buildAgentsMd, textResponse } from '@/utilities/aiDocuments'

export async function GET() {
  return textResponse(await buildAgentsMd())
}
