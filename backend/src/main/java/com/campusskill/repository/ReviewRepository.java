package com.campusskill.repository;

import com.campusskill.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    Optional<Review> findByBookingId(Long bookingId);

    List<Review> findByMentorSlug(String mentorSlug);

    List<Review> findByStudentName(String studentName);
}