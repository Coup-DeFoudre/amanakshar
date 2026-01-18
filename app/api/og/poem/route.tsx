import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'कविता'
  const poet = searchParams.get('poet') || 'अमन अक्षर'
  const bhav = searchParams.get('bhav') || ''
  const excerpt = searchParams.get('excerpt') || ''

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
            radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212, 168, 85, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 10% 20%, rgba(212, 168, 85, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 90% 80%, rgba(191, 122, 61, 0.08) 0%, transparent 35%)
          `,
          fontFamily: 'serif',
          padding: '60px',
        }}
      >
        {/* Top border decoration */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4a855, transparent)',
          }}
        />

        {/* Bhav tag if present */}
        {bhav && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              color: '#d4a855',
              fontSize: '24px',
            }}
          >
            <span>भाव:</span>
            <span style={{ color: '#c4b8a8' }}>{bhav}</span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#faf8f5',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '30px',
            textShadow: '0 0 40px rgba(212, 168, 85, 0.3)',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Excerpt if present */}
        {excerpt && (
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              color: '#c4b8a8',
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: '30px',
              maxWidth: '800px',
              fontStyle: 'italic',
            }}
          >
            "{excerpt}"
          </div>
        )}

        {/* Poet name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #7a6f60)',
            }}
          />
          <span
            style={{
              fontSize: '32px',
              color: '#d4a855',
            }}
          >
            — {poet}
          </span>
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'linear-gradient(90deg, #7a6f60, transparent)',
            }}
          />
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '1px',
              background: '#7a6f60',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              color: '#7a6f60',
            }}
          >
            amanakshar.com
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: '#7a6f60',
            }}
          />
        </div>

        {/* Corner decorations */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            width: '40px',
            height: '40px',
            borderLeft: '2px solid rgba(212, 168, 85, 0.3)',
            borderTop: '2px solid rgba(212, 168, 85, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '40px',
            height: '40px',
            borderRight: '2px solid rgba(212, 168, 85, 0.3)',
            borderTop: '2px solid rgba(212, 168, 85, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            width: '40px',
            height: '40px',
            borderLeft: '2px solid rgba(212, 168, 85, 0.3)',
            borderBottom: '2px solid rgba(212, 168, 85, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            width: '40px',
            height: '40px',
            borderRight: '2px solid rgba(212, 168, 85, 0.3)',
            borderBottom: '2px solid rgba(212, 168, 85, 0.3)',
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
