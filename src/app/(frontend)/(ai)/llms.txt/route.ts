import { buildLlmsTxt, textResponse } from '@/utilities/aiDocuments'

export async function GET() {
  return textResponse(await buildLlmsTxt())
}
