package com.campusskill.controller;

import com.campusskill.model.Booking;
import com.campusskill.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking) {

        boolean alreadyBooked =
                bookingRepository
                        .existsByMentorSlugAndBookingDateAndBookingTimeAndStatus(
                                booking.getMentorSlug(),
                                booking.getBookingDate(),
                                booking.getBookingTime(),
                                "CONFIRMED"
                        );

        if (alreadyBooked) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("This time slot is already booked.");
        }

        Booking savedBooking = bookingRepository.save(booking);

        return new ResponseEntity<>(
                savedBooking,
                HttpStatus.CREATED
        );
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        return ResponseEntity.ok(bookings);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        Optional<Booking> booking =
                bookingRepository.findById(id);

        return booking
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

 // Get bookings for a mentor
@GetMapping("/mentor/{mentorSlug}")
public ResponseEntity<List<Booking>> getMentorBookings(
        @PathVariable String mentorSlug,
        @RequestParam(required = false) LocalDate date) {

    List<Booking> bookings;

    if (date != null) {

        // Get confirmed bookings for a specific date
        bookings =
                bookingRepository.findByMentorSlugAndBookingDateAndStatus(
                        mentorSlug,
                        date,
                        "CONFIRMED"
                );

    } else {

        // Get all bookings for the mentor
        bookings =
                bookingRepository.findByMentorSlug(mentorSlug);
    }

    return ResponseEntity.ok(bookings);
}

// Get bookings for a specific student
@GetMapping("/student/{studentName}")
public ResponseEntity<List<Booking>> getStudentBookings(
        @PathVariable String studentName) {

    List<Booking> bookings =
            bookingRepository.findByStudentNameOrderByBookingDateAscBookingTimeAsc(
                    studentName
            );

    return ResponseEntity.ok(bookings);
}
// Cancel a booking
@PutMapping("/{id}/cancel")
public ResponseEntity<?> cancelBooking(
        @PathVariable Long id) {

    Optional<Booking> optionalBooking =
            bookingRepository.findById(id);

    if (optionalBooking.isEmpty()) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Booking not found.");
    }

    Booking booking = optionalBooking.get();

    if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("This booking is already cancelled.");
    }

    booking.setStatus("CANCELLED");

    Booking updatedBooking =
            bookingRepository.save(booking);

    return ResponseEntity.ok(updatedBooking);
}
}