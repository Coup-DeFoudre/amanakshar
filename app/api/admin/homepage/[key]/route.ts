import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { updateHomepageSection, getHomepageSection, defaultSections, type SectionKey } from '@/lib/homepage'

const validKeys = Object.keys(defaultSections)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key } = await params

  if (!validKeys.includes(key)) {
    return NextResponse.json({ error: 'Invalid section key' }, { status: 404 })
  }

  const sectionKey = key as SectionKey
  const section = await getHomepageSection(sectionKey)

  return NextResponse.json(section)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key } = await params

  if (!validKeys.includes(key)) {
    return NextResponse.json({ error: 'Invalid section key' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const sectionKey = key as SectionKey

    const updatedSection = await updateHomepageSection(sectionKey, {
      title: body.title,
      subtitle: body.subtitle,
      content: body.content,
      imageUrl: body.imageUrl,
      isActive: body.isActive,
    })

    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error('Error updating homepage section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}
