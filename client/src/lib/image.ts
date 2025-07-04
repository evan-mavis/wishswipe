/**
 * Transforms eBay image URLs to request higher quality versions
 * @param imageUrl - The original eBay image URL
 * @param size - The desired image size (default: 400)
 * @returns Enhanced URL for higher quality image
 */
export function getLargerImageUrl(
	imageUrl: string | undefined,
	size: number = 400
): string {
	if (!imageUrl) return "";

	// eBay image URLs typically have size parameters like s-l225, s-l300, etc.
	// Replace with larger sizes for better quality
	return imageUrl
		.replace(/s-l\d+/g, `s-l${size}`) // Replace any s-l### with s-l{size}
		.replace(/~~/g, `~~s-l${size}~~`); // Some URLs use ~~ format
}
