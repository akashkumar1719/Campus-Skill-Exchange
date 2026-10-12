
package com.campusskill.repository;

import com.campusskill.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyMaterialRepository
        extends JpaRepository<StudyMaterial, Long> {

    List<StudyMaterial> findByMentorSlug(String mentorSlug);

    List<StudyMaterial> findByMaterialType(String materialType);

    List<StudyMaterial> findByMentorSlugAndMaterialType(
            String mentorSlug,
            String materialType
    );
}