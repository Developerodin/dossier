import { buildLlmsFullTxt, textResponse } from '@/utilities/aiDocuments'

export async function GET() {
  return textResponse(await buildLlmsFullTxt(), { noindex: true })
}
