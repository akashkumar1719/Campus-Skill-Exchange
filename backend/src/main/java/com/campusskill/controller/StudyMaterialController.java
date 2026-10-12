
package com.campusskill.controller;

import com.campusskill.entity.StudyMaterial;
import com.campusskill.repository.StudyMaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-materials")
@CrossOrigin(origins = "http://localhost:5173")
public class StudyMaterialController {

    private final StudyMaterialRepository studyMaterialRepository;

    public StudyMaterialController(
            StudyMaterialRepository studyMaterialRepository) {
        this.studyMaterialRepository = studyMaterialRepository;
    }

    // 1. Get all study materials
    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAllMaterials() {
        return ResponseEntity.ok(studyMaterialRepository.findAll());
    }

    // 2. Get materials by mentor
    @GetMapping("/mentor/{mentorSlug}")
    public ResponseEntity<List<StudyMaterial>> getMaterialsByMentor(
            @PathVariable String mentorSlug) {
        return ResponseEntity.ok(
                studyMaterialRepository.findByMentorSlug(mentorSlug));
    }

    // 3. Get materials by type
    @GetMapping("/type/{materialType}")
    public ResponseEntity<List<StudyMaterial>> getMaterialsByType(
            @PathVariable String materialType) {
        return ResponseEntity.ok(
                studyMaterialRepository.findByMaterialType(
                        materialType.toUpperCase()));
    }

    // 4. Add a study material
    @PostMapping
    public ResponseEntity<StudyMaterial> addMaterial(
            @RequestBody StudyMaterial material) {

        material.setId(null);
        material.setCreatedAt(null);

        StudyMaterial savedMaterial =
                studyMaterialRepository.save(material);

        return ResponseEntity.ok(savedMaterial);
    }

    // 5. Update a study material
    @PutMapping("/{id}")
    public ResponseEntity<StudyMaterial> updateMaterial(
            @PathVariable Long id,
            @RequestBody StudyMaterial updatedMaterial) {

        return studyMaterialRepository.findById(id)
                .map(existingMaterial -> {
                    existingMaterial.setTitle(updatedMaterial.getTitle());
                    existingMaterial.setDescription(
                            updatedMaterial.getDescription());
                    existingMaterial.setMaterialType(
                            updatedMaterial.getMaterialType());
                    existingMaterial.setMentorSlug(
                            updatedMaterial.getMentorSlug());
                    existingMaterial.setResourceUrl(
                            updatedMaterial.getResourceUrl());

                    StudyMaterial savedMaterial =
                            studyMaterialRepository.save(existingMaterial);

                    return ResponseEntity.ok(savedMaterial);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 6. Delete a study material
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable Long id) {

        if (!studyMaterialRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        studyMaterialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

