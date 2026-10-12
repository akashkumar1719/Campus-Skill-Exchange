
package com.campusskill.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    // PDF, NOTES, PPT, LINK, ASSIGNMENT
    private String materialType;

    private String mentorSlug;

    private String resourceUrl;

    private LocalDateTime createdAt;

    public StudyMaterial() {
    }

    public StudyMaterial(
            String title,
            String description,
            String materialType,
            String mentorSlug,
            String resourceUrl
    ) {
        this.title = title;
        this.description = description;
        this.materialType = materialType;
        this.mentorSlug = mentorSlug;
        this.resourceUrl = resourceUrl;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public String getMentorSlug() {
        return mentorSlug;
    }

    public void setMentorSlug(String mentorSlug) {
        this.mentorSlug = mentorSlug;
    }

    public String getResourceUrl() {
        return resourceUrl;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}