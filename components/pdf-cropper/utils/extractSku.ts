export function extractSkuFromText(text: string): string | null {
    if (!text) return null

    // Normalize whitespace
    const normalized = text.replace(/\s+/g, " ").trim()

    /**
     * Match:
     * <SKU> | <Description>
     *
     * SKU allowed chars:
     * A-Z a-z 0-9 - _
     */
    const pipeMatch = normalized.match(
        /([A-Z0-9_-]+)\s*\|/i
    )

    if (pipeMatch?.[1]) {
        return pipeMatch[1].trim()
    }

    return null
}
