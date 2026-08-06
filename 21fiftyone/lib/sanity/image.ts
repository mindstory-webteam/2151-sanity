import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

/**
 * Safely builds a Sanity image URL builder instance.
 * Returns null if the source has no resolvable asset reference
 * (e.g. a mainImage field where alt text was set but no image was uploaded).
 */
export function urlForImage(source?: Image | { asset?: { _ref?: string } } | null) {
  if (!source || !source.asset || !("_ref" in source.asset) || !source.asset._ref) {
    return null;
  }
  return builder.image(source);
}