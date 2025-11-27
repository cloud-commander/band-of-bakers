import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { ReviewWithUser } from "@/lib/repositories/review.repository";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.user_avatar || undefined} alt={review.user_name} />
            <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{review.user_name}</span>
              {review.verified_purchase && (
                <span className="text-green-600 flex items-center gap-0.5 text-xs">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size={12} />
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {review.title && <h4 className="font-semibold text-sm">{review.title}</h4>}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </div>
  );
}
