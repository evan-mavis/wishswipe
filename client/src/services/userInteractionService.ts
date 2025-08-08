import axiosInstance from "@/interceptors/axiosInstance";

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
	// for right swipes
	wishlistId?: string;
	title?: string;
	imageUrl?: string;
	itemWebUrl?: string;
	sellerFeedbackScore?: number;
}

class UserInteractionService {
	private interactionQueue: UserInteraction[] = [];
	private batchSize = 10;
	private flushTimeout: NodeJS.Timeout | null = null;
	private flushDelay = 3000; // 3 seconds - reduced for more responsive updates

	/**
	 * Add an interaction to the queue
	 */
	addInteraction(interaction: Omit<UserInteraction, "timestamp">): void {
		this.interactionQueue.push({
			...interaction,
			timestamp: new Date(),
		});

		// flush if we reach batch size
		if (this.interactionQueue.length >= this.batchSize) {
			this.flushQueue();
		} else {
			// set timeout to flush after delay
			this.scheduleFlush();
		}
	}

	/**
	 * Schedule a flush after the delay
	 */
	private scheduleFlush(): void {
		if (this.flushTimeout) {
			clearTimeout(this.flushTimeout);
		}

		this.flushTimeout = setTimeout(() => {
			this.flushQueue();
		}, this.flushDelay);
	}

	/**
	 * Flush the queue to the backend
	 */
	async flushQueue(): Promise<void> {
		if (this.interactionQueue.length === 0) return;

		const interactions = [...this.interactionQueue];
		this.interactionQueue = [];

		if (this.flushTimeout) {
			clearTimeout(this.flushTimeout);
			this.flushTimeout = null;
		}

		// at this point, interactions array is guaranteed to have items
		// because we checked this.interactionqueue.length > 0 at the start
		try {
			await axiosInstance.post("/wishswipe/user-item-history/batch", {
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
			});
		} catch (error) {
			console.error("Failed to send interactions to backend:", error);

			// re-queue failed interactions
			this.interactionQueue.unshift(...interactions);

			// try again after a delay
			setTimeout(() => {
				this.flushQueue();
			}, 10000); // 10 seconds
		}
	}

	/**
	 * Force flush all pending interactions
	 */
	async forceFlush(): Promise<void> {
		await this.flushQueue();
	}

	/**
	 * Get current queue size
	 */
	getQueueSize(): number {
		return this.interactionQueue.length;
	}

	/**
	 * Clear the queue (useful for testing or reset)
	 */
	clearQueue(): void {
		this.interactionQueue = [];
		if (this.flushTimeout) {
			clearTimeout(this.flushTimeout);
			this.flushTimeout = null;
		}
	}
}

// export singleton instance
export const userInteractionService = new UserInteractionService();
