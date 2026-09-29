import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { lookGroups } from './catalog'

const publicDir = join(import.meta.dirname, '../../../../public')

const previews = lookGroups.flatMap((group) =>
  group.options.flatMap((option) =>
    option.preview
      ? [{ part: group.part, id: option.id, preview: option.preview }]
      : []
  )
)

describe('direction previews', () => {
  it('gives every option its own picture', () => {
    const seen = new Set(previews.map((entry) => entry.preview))
    expect(seen.size).toBe(previews.length)
  })

  it.for(previews)('$part $id points at a picture that exists', (entry) => {
    expect(existsSync(join(publicDir, entry.preview))).toBe(true)
  })
})
