package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ScanRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.UserRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service class for managing operations related to scan persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScanPersistenceService {

    private final ScanRepository scanRepository;

    /**
     * Retrieves a scan entity by its ID.
     *
     * @param id The ID of the scan to retrieve.
     * @return The retrieved scan entity.
     * @throws ScanNotFoundException If the scan with the specified ID is not found.
     */
    public Scan getById(String id) throws ScanNotFoundException {
        log.debug("get by id user: {}", id);
        if (id != null) {
            Optional<Scan> found = scanRepository.findById(id);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new ScanNotFoundException("User not found");
    }
}
