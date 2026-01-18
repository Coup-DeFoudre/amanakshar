import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'अमन अक्षर — कवि'
  const subtitle = searchParams.get('subtitle') || 'कविताओं, प्रस्तुतियों और पुस्तकों का साहित्यिक घर'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0908',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212, 168, 85, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 20% 30%, rgba(212, 168, 85, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(191, 122, 61, 0.06) 0%, transparent 35%)
          `,
          fontFamily: 'serif',
          padding: '80px',
        }}
      >
        {/* Central glow */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 168, 85, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Decorative lines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #d4a855)',
            }}
          />
          <span
            style={{
              fontSize: '28px',
              color: '#d4a855',
            }}
          >
            ॥
          </span>
          <div
            style={{
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, #d4a855, transparent)',
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '80px',
            fontWeight: 'bold',
            color: '#faf8f5',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '30px',
            textShadow: '0 0 60px rgba(212, 168, 85, 0.4)',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#c4b8a8',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          {subtitle}
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #7a6f60)',
            }}
          />
          <span
            style={{
              fontSize: '24px',
              color: '#7a6f60',
            }}
          >
            amanakshar.com
          </span>
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, #7a6f60, transparent)',
            }}
          />
        </div>

        {/* Corner decorations */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderLeft: '2px solid rgba(212, 168, 85, 0.4)',
            borderTop: '2px solid rgba(212, 168, 85, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderRight: '2px solid rgba(212, 168, 85, 0.4)',
            borderTop: '2px solid rgba(212, 168, 85, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderLeft: '2px solid rgba(212, 168, 85, 0.4)',
            borderBottom: '2px solid rgba(212, 168, 85, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderRight: '2px solid rgba(212, 168, 85, 0.4)',
            borderBottom: '2px solid rgba(212, 168, 85, 0.4)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
