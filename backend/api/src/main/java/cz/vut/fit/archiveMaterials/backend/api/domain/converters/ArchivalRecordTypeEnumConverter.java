package cz.vut.fit.archiveMaterials.backend.api.domain.converters;

import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA AttributeConverter for converting between ArchivalRecordTypeEnum and String
 * when persisting the enum values in the database.
 *
 * Converter(autoApply = true) Indicates that this converter should be automatically applied
 * to all attributes of type ArchivalRecordTypeEnum in entities.
 */
@Converter(autoApply = true)
public class ArchivalRecordTypeEnumConverter implements AttributeConverter<ArchivalRecordTypeEnum, String> {

    /**
     * Converts the ArchivalRecordTypeEnum to its equivalent string representation for database storage.
     *
     * @param attribute The ArchivalRecordTypeEnum attribute to be converted.
     * @return The string representation of the ArchivalRecordTypeEnum for database storage.
     */
    @Override
    public String convertToDatabaseColumn(ArchivalRecordTypeEnum attribute) {
        // Convert enum to string
        return attribute != null ? attribute.name() : null;
    }

    /**
     * Converts the stored string representation from the database to its equivalent ArchivalRecordTypeEnum.
     *
     * @param dbData The string representation of the ArchivalRecordTypeEnum from the database.
     * @return The corresponding ArchivalRecordTypeEnum.
     */
    @Override
    public ArchivalRecordTypeEnum convertToEntityAttribute(String dbData) {
        // Convert string to enum
        return dbData != null ? ArchivalRecordTypeEnum.valueOf(dbData) : null;
    }
}
