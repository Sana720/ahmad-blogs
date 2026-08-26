export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  text: string;
  createdAt: number; // Unix timestamp for easier sorting/JSON serialization
  status: "pending" | "approved" | "rejected";
  source: "user" | "google_seeded";
}
