package cz.vut.fit.archiveMaterials.backend.api.domain.bridges;

import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import org.hibernate.search.mapper.pojo.bridge.ValueBridge;
import org.hibernate.search.mapper.pojo.bridge.runtime.ValueBridgeFromIndexedValueContext;
import org.hibernate.search.mapper.pojo.bridge.runtime.ValueBridgeToIndexedValueContext;

/**
 * Implementation of a ValueBridge for converting between ArchivalRecordTypeEnum and String.
 * This bridge is used for indexing ArchivalRecordTypeEnum values.
 */
public class TypeOfRecordValueBridge implements ValueBridge<ArchivalRecordTypeEnum, String> {

    /**
     * Converts the indexed value (String) to its corresponding ArchivalRecordTypeEnum.
     *
     * @param value   The indexed value (String) to be converted.
     * @param context The context for the conversion process.
     * @return The corresponding ArchivalRecordTypeEnum.
     * @throws IllegalArgumentException if the provided value is not a valid enum value.
     */
    @Override
    public ArchivalRecordTypeEnum fromIndexedValue(String value, ValueBridgeFromIndexedValueContext context) {
        ArchivalRecordTypeEnum[] var1 = ArchivalRecordTypeEnum.values();
        int var2 = var1.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            ArchivalRecordTypeEnum b = var1[var3];
            if (b.getValue().equals(value)) {
                return b;
            }
        }

        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }

    /**
     * Converts the ArchivalRecordTypeEnum to its indexed value (String).
     *
     * @param value   The ArchivalRecordTypeEnum to be converted.
     * @param context The context for the conversion process.
     * @return The indexed value (String) representing the ArchivalRecordTypeEnum.
     */
    @Override
    public String toIndexedValue(ArchivalRecordTypeEnum value, ValueBridgeToIndexedValueContext context) {
        return value == null ? null : value.toString();
    }
}
