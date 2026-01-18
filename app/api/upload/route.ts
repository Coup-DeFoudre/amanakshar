import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  saveImageToPublic, 
  generateUniqueFilename, 
  getImageDirectory,
  parseBase64Image,
  validateImageBuffer,
  isValidImageMimeType
} from '@/lib/image-storage'

type ImageType = 'poet' | 'event' | 'performance' | 'og-image' | 'book'

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageData, type, filename } = body as {
      imageData: string
      type: ImageType
      filename?: string
    }

    if (!imageData) {
      return NextResponse.json(
        { error: 'छवि डेटा आवश्यक है' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'छवि प्रकार आवश्यक है' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes: ImageType[] = ['poet', 'event', 'performance', 'og-image', 'book']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'अमान्य छवि प्रकार' },
        { status: 400 }
      )
    }

    // Parse base64 data
    const parsed = parseBase64Image(imageData)
    if (!parsed) {
      return NextResponse.json(
        { error: 'अमान्य छवि डेटा प्रारूप' },
        { status: 400 }
      )
    }

    const { buffer, mimeType, extension } = parsed

    // Validate MIME type
    if (!isValidImageMimeType(mimeType)) {
      return NextResponse.json(
        { error: 'केवल JPEG, PNG, WebP, GIF, या SVG फाइलें स्वीकार्य हैं' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const validation = validateImageBuffer(buffer, 10)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Generate unique filename
    const uniqueFilename = filename 
      ? `${Date.now()}-${filename}`
      : generateUniqueFilename(`upload.${extension}`)

    // Get directory for this image type
    const directory = getImageDirectory(type)

    // Save the image
    const savedPath = await saveImageToPublic(buffer, directory, uniqueFilename)

    return NextResponse.json({
      success: true,
      url: savedPath,
      path: savedPath,
      size: buffer.length,
      mimeType,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'छवि अपलोड करने में त्रुटि हुई' },
      { status: 500 }
    )
  }
}
