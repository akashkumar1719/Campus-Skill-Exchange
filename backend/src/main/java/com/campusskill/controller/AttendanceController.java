package com.campusskill.controller;

import com.campusskill.model.Attendance;
import com.campusskill.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(
            AttendanceRepository attendanceRepository
    ) {
        this.attendanceRepository = attendanceRepository;
    }

    // Save attendance
    @PostMapping
    public ResponseEntity<Attendance> saveAttendance(
            @RequestBody Attendance attendance
    ) {

        attendance.setMarkedAt(LocalDateTime.now());

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return ResponseEntity.ok(savedAttendance);
    }

    // Get attendance by booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getAttendanceByBookingId(
            @PathVariable Long bookingId
    ) {

        Optional<Attendance> attendance =
                attendanceRepository.findByBookingId(bookingId);

        if (attendance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(attendance.get());
    }

    // Update attendance
    @PutMapping("/booking/{bookingId}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long bookingId,
            @RequestBody Attendance updatedAttendance
    ) {

        Optional<Attendance> existingAttendance =
                attendanceRepository.findByBookingId(bookingId);

        if (existingAttendance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Attendance attendance =
                existingAttendance.get();

        attendance.setStatus(
                updatedAttendance.getStatus()
        );

        attendance.setStudentName(
                updatedAttendance.getStudentName()
        );

        attendance.setMentorSlug(
                updatedAttendance.getMentorSlug()
        );

        attendance.setMarkedAt(
                LocalDateTime.now()
        );

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return ResponseEntity.ok(savedAttendance);
    }
}