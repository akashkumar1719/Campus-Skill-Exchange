package com.campusskill.repository;

import com.campusskill.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByMentorSlugAndBookingDateAndBookingTimeAndStatus(
            String mentorSlug,
            LocalDate bookingDate,
            LocalTime bookingTime,
            String status
    );

    List<Booking> findByMentorSlugAndBookingDateAndStatus(
            String mentorSlug,
            LocalDate bookingDate,
            String status
    );

    List<Booking> findByMentorSlug(String mentorSlug);

    List<Booking> findByStudentNameOrderByBookingDateAscBookingTimeAsc(
            String studentName
    );
}