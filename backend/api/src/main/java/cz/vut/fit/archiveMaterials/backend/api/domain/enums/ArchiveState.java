package cz.vut.fit.archiveMaterials.backend.api.domain.enums;

/**
 * Enum representing the states where an archive may be located.
 *
 * <p>Each state is associated with a specific country or region.</p>
 *
 * The possible values are:
 * <ul>
 *     <li>{@code CZECH_REPUBLIC}: Archives located in the Czech Republic.</li>
 *     <li>{@code SLOVAKIA}: Archives located in Slovakia.</li>
 *     <li>{@code AUSTRIA}: Archives located in Austria.</li>
 * </ul>
 *
 *
 * <p>This enum is typically used to categorize or identify the geographical location of an archive.</p>
 */
public enum ArchiveState {
    CZECH_REPUBLIC, SLOVAKIA, AUSTRIA;
}
