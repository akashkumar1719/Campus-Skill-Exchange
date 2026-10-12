package com.campusskill.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private String studentName;

    private String mentorSlug;

    private String status;

    private LocalDateTime markedAt;

    public Attendance() {
    }

    public Attendance(
            Long bookingId,
            String studentName,
            String mentorSlug,
            String status,
            LocalDateTime markedAt
    ) {
        this.bookingId = bookingId;
        this.studentName = studentName;
        this.mentorSlug = mentorSlug;
        this.status = status;
        this.markedAt = markedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getMentorSlug() {
        return mentorSlug;
    }

    public void setMentorSlug(String mentorSlug) {
        this.mentorSlug = mentorSlug;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }
}