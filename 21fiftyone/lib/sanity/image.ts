import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

// Accepts any image-ish object returned from a GROQ query (asset ref,
// optional hotspot/crop, plus our own custom fields like `alt`) rather
// than being locked to Sanity Studio's exact internal Image type — the
// two shapes overlap but aren't identical, which breaks type-checking
// on every call site otherwise.
export function urlForImage(source: unknown) {
  return builder.image(source as never)
}