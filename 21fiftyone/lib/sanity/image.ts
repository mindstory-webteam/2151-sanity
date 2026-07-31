import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

// Accepts any image-ish object returned from a GROQ query (asset ref,
// optional hotspot/crop, plus our own custom fields like `alt`) rather
// than being locked to Sanity Studio's exact internal Image type — the
// two shapes overlap but aren't identical, which breaks type-checking
// on every call site otherwise.
export function urlForImage(source: unknown) {
  const img = source as { asset?: unknown } | null | undefined

  // Deliberately ignore any stored crop/hotspot. If an asset gets
  // re-encoded (e.g. to WebP) at different pixel dimensions than what
  // the crop was originally calculated against, the stored rectangle
  // can describe a region outside the actual image bounds — Sanity's
  // CDN then 400s. Passing only the asset reference makes the CDN
  // compute a fresh center-crop against the real file every time,
  // which can never go out of bounds. Trade-off: any custom hotspot
  // an editor picked in Studio is no longer respected — worth
  // re-enabling later (pass `img` instead of `safeSource`) once the
  // underlying asset dimension mismatch is sorted out for good.
  const safeSource = img?.asset ? { asset: img.asset } : source

  return builder.image(safeSource as never)
}