/**
 * Simple client-side rate limiter to prevent excessive API calls
 */
class RateLimiter {
  private timestamps: Map<string, number[]> = new Map();
  private limits: Map<string, { maxRequests: number; windowMs: number }> =
    new Map();

  /**
   * Set rate limit for a specific key
   * @param key - Identifier for the rate limit (e.g., 'ai-generate')
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   */
  setLimit(key: string, maxRequests: number, windowMs: number): void {
    this.limits.set(key, { maxRequests, windowMs });
  }

  /**
   * Check if request is allowed
   * @param key - Identifier for the rate limit
   * @returns true if request is allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const limit = this.limits.get(key);
    if (!limit) {
      // No limit set, allow by default
      return true;
    }

    const now = Date.now();
    const timestamps = this.timestamps.get(key) || [];

    // Remove timestamps outside the window
    const validTimestamps = timestamps.filter(
      (ts) => now - ts < limit.windowMs,
    );

    // Check if under limit
    if (validTimestamps.length < limit.maxRequests) {
      validTimestamps.push(now);
      this.timestamps.set(key, validTimestamps);
      return true;
    }

    return false;
  }

  /**
   * Get time until next request is allowed
   * @param key - Identifier for the rate limit
   * @returns milliseconds until next request, or 0 if allowed now
   */
  getTimeUntilNextRequest(key: string): number {
    const limit = this.limits.get(key);
    if (!limit) {
      return 0;
    }

    const now = Date.now();
    const timestamps = this.timestamps.get(key) || [];

    if (timestamps.length < limit.maxRequests) {
      return 0;
    }

    const oldestTimestamp = Math.min(...timestamps);
    const timeUntilExpiry = limit.windowMs - (now - oldestTimestamp);

    return Math.max(0, timeUntilExpiry);
  }

  /**
   * Clear rate limit history for a key
   */
  clear(key: string): void {
    this.timestamps.delete(key);
  }

  /**
   * Clear all rate limit history
   */
  clearAll(): void {
    this.timestamps.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Set default limits for common operations
rateLimiter.setLimit("ai-generate-flashcards", 5, 60000); // 5 requests per minute
rateLimiter.setLimit("ai-extract-flashcards", 5, 60000); // 5 requests per minute
rateLimiter.setLimit("ai-chat", 10, 60000); // 10 requests per minute
