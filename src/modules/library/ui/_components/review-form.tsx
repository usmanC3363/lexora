import { ReviewsGetOneOutput } from "@/modules/reviews/types";

interface ReviewFormProps {
  initialData: ReviewsGetOneOutput;
  productId: string;
}
export const ReviewForm = ({ initialData, productId }: ReviewFormProps) => {
  return <div className="">Review Form</div>;
};
