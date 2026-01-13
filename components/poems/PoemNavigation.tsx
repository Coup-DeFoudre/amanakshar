'use client'

import Link from 'next/link'
import { TextButton } from '@/components/ui/TextButton'

interface PoemNavigationProps {
  prevPoem?: { title: string; slug: string }
  nextPoem?: { title: string; slug: string }
}

export function PoemNavigation({ prevPoem, nextPoem }: PoemNavigationProps) {
  return (
    <nav className="flex justify-between items-center py-8 border-t border-divider mt-12">
      <div>
        {prevPoem && (
          <Link href={`/kavita/${prevPoem.slug}`}>
            <TextButton icon="←">
              <span className="hidden sm:inline">{prevPoem.title}</span>
              <span className="sm:hidden">पिछली कविता</span>
            </TextButton>
          </Link>
        )}
      </div>
      
      <div>
        {nextPoem && (
          <Link href={`/kavita/${nextPoem.slug}`}>
            <TextButton icon="→" iconPosition="right">
              <span className="hidden sm:inline">{nextPoem.title}</span>
              <span className="sm:hidden">अगली कविता</span>
            </TextButton>
          </Link>
        )}
      </div>
    </nav>
  )
}

