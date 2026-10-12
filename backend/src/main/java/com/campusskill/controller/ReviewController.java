package com.campusskill.controller;

import com.campusskill.model.Review;
import com.campusskill.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(
            ReviewRepository reviewRepository
    ) {
        this.reviewRepository = reviewRepository;
    }

    // =========================================================
    // CREATE REVIEW
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestBody Review review
    ) {

        // Prevent duplicate review for the same booking
        Optional<Review> existingReview =
                reviewRepository.findByBookingId(
                        review.getBookingId()
                );

        if (existingReview.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("A review already exists for this booking.");
        }

        // Validate rating
        if (review.getRating() == null ||
                review.getRating() < 1 ||
                review.getRating() > 5) {

            return ResponseEntity
                    .badRequest()
                    .body("Rating must be between 1 and 5.");
        }

        review.setCreatedAt(LocalDateTime.now());

        Review savedReview =
                reviewRepository.save(review);

        return ResponseEntity.ok(savedReview);
    }

    // =========================================================
    // GET REVIEW BY BOOKING ID
    // =========================================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getReviewByBookingId(
            @PathVariable Long bookingId
    ) {

        Optional<Review> review =
                reviewRepository.findByBookingId(
                        bookingId
                );

        if (review.isEmpty()) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(review.get());
    }

    // =========================================================
    // GET REVIEWS BY MENTOR
    // =========================================================

    @GetMapping("/mentor/{mentorSlug}")
    public ResponseEntity<List<Review>> getReviewsByMentor(
            @PathVariable String mentorSlug
    ) {

        List<Review> reviews =
                reviewRepository.findByMentorSlug(
                        mentorSlug
                );

        return ResponseEntity.ok(reviews);
    }

    // =========================================================
    // GET REVIEWS BY STUDENT
    // =========================================================

    @GetMapping("/student/{studentName}")
    public ResponseEntity<List<Review>> getReviewsByStudent(
            @PathVariable String studentName
    ) {

        List<Review> reviews =
                reviewRepository.findByStudentName(
                        studentName
                );

        return ResponseEntity.ok(reviews);
    }

    // =========================================================
    // UPDATE REVIEW
    // =========================================================

    @PutMapping("/booking/{bookingId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long bookingId,
            @RequestBody Review updatedReview
    ) {

        Optional<Review> existingReview =
                reviewRepository.findByBookingId(
                        bookingId
                );

        if (existingReview.isEmpty()) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Validate rating
        if (updatedReview.getRating() == null ||
                updatedReview.getRating() < 1 ||
                updatedReview.getRating() > 5) {

            return ResponseEntity
                    .badRequest()
                    .body("Rating must be between 1 and 5.");
        }

        Review review =
                existingReview.get();

        review.setRating(
                updatedReview.getRating()
        );

        review.setComment(
                updatedReview.getComment()
        );

        review.setCreatedAt(
                LocalDateTime.now()
        );

        Review savedReview =
                reviewRepository.save(review);

        return ResponseEntity.ok(savedReview);
    }
}