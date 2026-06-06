export interface UserInteraction {
  itemId: string;
  action: "left" | "right";
  searchQuery: string;
  conditionFilter?: string;
  categoryFilter?: string;
  priceMin?: number;
  priceMax?: number;
  itemPrice: number;
  timestamp: Date;
  searchSessionId?: string;
  wishlistId?: string;
  title?: string;
  imageUrl?: string;
  itemWebUrl?: string;
  sellerFeedbackScore?: number;
}

class UserInteractionService {
  private interactionQueue: UserInteraction[] = [];
  private batchSize = 10;
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private flushDelay = 3000;

  addInteraction(interaction: Omit<UserInteraction, "timestamp">) {
    this.interactionQueue.push({
      ...interaction,
      timestamp: new Date(),
    });

    if (this.interactionQueue.length >= this.batchSize) {
      void this.flushQueue();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush() {
    if (this.flushTimeout) clearTimeout(this.flushTimeout);
    this.flushTimeout = setTimeout(() => {
      void this.flushQueue();
    }, this.flushDelay);
  }

  async flushQueue() {
    if (this.interactionQueue.length === 0) return;

    const interactions = [...this.interactionQueue];
    this.interactionQueue = [];

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    try {
      const response = await fetch("/api/interactions/batch", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          interactions: interactions.map((interaction) => ({
            itemId: interaction.itemId,
            action: interaction.action,
            searchQuery: interaction.searchQuery,
            conditionFilter: interaction.conditionFilter,
            categoryFilter: interaction.categoryFilter,
            priceMin: interaction.priceMin,
            priceMax: interaction.priceMax,
            price: interaction.itemPrice,
            wishlistId: interaction.wishlistId,
            title: interaction.title,
            imageUrl: interaction.imageUrl,
            itemWebUrl: interaction.itemWebUrl,
            sellerFeedbackScore: interaction.sellerFeedbackScore,
          })),
          searchSessionId: interactions[0]?.searchSessionId || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to flush interactions");
    } catch (error) {
      console.error("Failed to send interactions:", error);
      this.interactionQueue.unshift(...interactions);
      setTimeout(() => {
        void this.flushQueue();
      }, 10000);
    }
  }

  async forceFlush() {
    await this.flushQueue();
  }

  getQueueSize() {
    return this.interactionQueue.length;
  }

  clearQueue() {
    this.interactionQueue = [];
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
}

export const userInteractionService = new UserInteractionService();
