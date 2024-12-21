import React, { useState} from "react";
import "../styles/RatingForm.css"; // Add custom styles for the form if needed

function RatingForm({ jobId, freelancerId }) {
  const [rating, setRating] = useState(0); // To store the selected rating
  const [feedback, setFeedback] = useState(""); // To store written feedback
  const [submitted, setSubmitted] = useState(false); // To track if the rating has been submitted

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedbackData = {
      jobId: jobId || null, // Pass jobId if available
      freelancerId: freelancerId || null, // Pass freelancerId if available
      rating,
      feedback,
    };

    // Optional: Replace the following fetch with real logic when the backend is functional
    fetch("http://127.0.0.1:5000/submit_rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
  };

  return (
    <div className="rating-form-container">
      <h3>Please Rate Our Recommendations </h3>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                className={`rating-button ${rating === value ? "selected" : ""}`}
                onClick={() => handleRatingChange(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </label>
          <button type="submit" className="submit-rating-button" disabled={rating === 0}>
            Submit Rating
          </button>
        </form>
      ) : (
        <p className="thank-you-message">Thank you for your feedback!</p>
      )}
    </div>
  );
}

export default RatingForm;
