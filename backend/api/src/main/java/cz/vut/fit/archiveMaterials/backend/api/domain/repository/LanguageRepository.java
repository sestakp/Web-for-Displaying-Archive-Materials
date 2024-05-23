package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;

import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for managing {@link Language} entities.
 *
 * <p>This interface extends {@link JpaRepository} to provide basic CRUD operations for the {@link Language} entity.</p>
 */
public interface LanguageRepository extends JpaRepository<Language, Long> {

    /**
     * Finds all languages with names present in the specified set of language names.
     *
     * <p>This method returns a {@link Set} of languages whose names are present in the provided set of language names.</p>
     *
     * @param languageNames The set of language names to search for.
     * @return A {@link Set} of languages whose names are present in the specified set of language names.
     */
    Set<Language> findAllByNameIsIn(Set<String> languageNames);
}
