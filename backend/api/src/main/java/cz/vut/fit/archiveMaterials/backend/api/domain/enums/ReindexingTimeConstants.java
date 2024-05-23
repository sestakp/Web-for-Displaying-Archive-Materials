package cz.vut.fit.archiveMaterials.backend.api.domain.enums;

import java.time.LocalDateTime;

public enum ReindexingTimeConstants {
    MIN_DATE(LocalDateTime.of(1000, 1, 1, 0, 0, 0));

    private final LocalDateTime value;

    ReindexingTimeConstants(LocalDateTime value) {
        this.value = value;
    }

    public LocalDateTime getValue() {
        return value;
    }
}
