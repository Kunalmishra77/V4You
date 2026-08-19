import Image from 'next/image'

import { BrandFigure, type FigureName } from '@/components/shared/BrandFigure'
import { reportMissingAsset } from '@/lib/missing-assets'
import { cn } from '@/lib/utils'

/**
 * A slot for real photography, with an abstract figure standing in until it
 * arrives.
 *
 * The fallback is deliberately *not* a grey box, a blurred placeholder or a
 * stock image. A grey box looks broken; a stock photograph of an office implies
 * it is this company's office, which is a claim nobody made and nobody can
 * support. An abstract figure in the brand's own geometry looks intentional and
 * asserts nothing — so the page is presentable today and truthful today, and
 * gets warmer the moment a real photograph exists.
 *
 * Photography must be the client's own: their space, their people, their work.
 * Stock people are ruled out for the same reason invented metrics are.
 * `docs/08` treats anything that implies a fact as needing evidence.
 */
export function Photo({
  src,
  alt,
  fallback,
  needs,
  className,
  imageClassName,
  priority = false,
}: {
  /** Path under /public. Leave undefined until the real photograph exists. */
  src?: string
  /** Required whenever `src` is set. Describe what the photograph shows. */
  alt?: string
  /** Which abstract figure stands in meanwhile. */
  fallback: FigureName
  /** What to shoot, for MISSING-ASSETS.md. */
  needs: string
  className?: string
  imageClassName?: string
  priority?: boolean
}) {
  if (src && alt !== undefined) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className={cn('object-cover', imageClassName)}
        />
      </div>
    )
  }

  reportMissingAsset({
    component: 'Photo',
    needs,
    blocks: 'an abstract brand figure stands in — presentable, and claims nothing',
  })

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <BrandFigure name={fallback} className="max-w-[min(100%,22rem)]" />
    </div>
  )
}
