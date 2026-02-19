import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendReview } from "../../services/booksApi";
import "../../styles/ReviewModel.css"
import Input from "../ui/Input";

const ReviewModel = ({ id, isOpen, onClose }) => {

    const queryClient = useQueryClient();
    const [rating, setRating] = useState(1)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")



    const createReviewMutation = useMutation({
        mutationFn: sendReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["book"] });

            onClose();
        },
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) return;

        createReviewMutation.mutate({
            id,
            title,
            rating,
            comment
        });
    };

    if (createReviewMutation.error) { console.log(createReviewMutation.error) }
    if (!isOpen) return
    return (
        <div className="modal-backdrop">
            <form className="modal">
                <h3>Write a review</h3>
                <br />
                {/* Rating */}
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={star <= rating ? "star active" : "star"}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <Input type={"text"} name={"title"} placeholder={"Review Title*"} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
                <br />
                {/* Review text */}
                <textarea
                    placeholder="Description*"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                />
                <br />

                {createReviewMutation.error && <p style={{ color: "red" }}>{createReviewMutation.error?.response?.data?.message}</p>}

                {/* Actions */}
                <div className="actions">
                    <button type="button" className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!rating || createReviewMutation.isPending}
                    >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewModel;
