package com.campusskill.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private String studentName;

    private String mentorSlug;

    private Integer rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt;

    public Review() {
    }

    public Review(
            Long bookingId,
            String studentName,
            String mentorSlug,
            Integer rating,
            String comment,
            LocalDateTime createdAt
    ) {
        this.bookingId = bookingId;
        this.studentName = studentName;
        this.mentorSlug = mentorSlug;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
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

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}