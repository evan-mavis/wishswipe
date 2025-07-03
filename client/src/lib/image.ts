/**
 * Transforms eBay image URLs to request higher quality versions
 * @param imageUrl - The original eBay image URL
 * @returns Enhanced URL for higher quality image
 */
export function getLargerImageUrl(imageUrl: string | undefined): string {
	if (!imageUrl) return "";

	// eBay image URLs typically have size parameters like s-l225, s-l300, etc.
	// Replace with larger sizes: s-l450 for better quality
	return imageUrl
		.replace(/s-l\d+/g, "s-l450") // Replace any s-l### with s-l450
		.replace(/~~/g, "~~s-l450~~"); // Some URLs use ~~ format
}
