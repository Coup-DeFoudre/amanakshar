import { NextRequest, NextResponse } from 'next/server'
import satori from 'satori'
import sharp from 'sharp'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const line = searchParams.get('line') || 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं'
  const poet = searchParams.get('poet') || 'अमन अक्षर'
  
  try {
    // Fetch the font
    const fontResponse = await fetch(
      'https://fonts.gstatic.com/s/notoserifdevanagari/v28/x3dYcl3IZKmUqiMk48ZHXJ5jwU-DZGRSaQ4Hh2dGyFzPLcQPVbnRNeFsw0xRWb6uxTA-ow-HMUe1u_dv.ttf'
    )
    const fontData = await fontResponse.arrayBuffer()
    
    // Generate SVG with satori
    const svg = await satori(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '60px',
          fontFamily: 'Noto Serif Devanagari',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            color: '#f5f0e8',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: '900px',
          }}
        >
          "{line}"
        </div>
        <div
          style={{
            marginTop: '40px',
            fontSize: '24px',
            color: '#c9c4bc',
          }}
        >
          — {poet}
        </div>
      </div>,
      {
        width: 1080,
        height: 1080,
        fonts: [
          {
            name: 'Noto Serif Devanagari',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    )
    
    // Convert SVG to PNG using sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer()
    
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating share image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
