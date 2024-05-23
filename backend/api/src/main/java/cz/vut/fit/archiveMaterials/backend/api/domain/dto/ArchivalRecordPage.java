package cz.vut.fit.archiveMaterials.backend.api.domain.dto;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import lombok.Data;

import java.util.List;

/**
 * Represents a paginated result set of {@link ArchivalRecord} entities.
 * <p>
 * The pagination information includes the content of the current page, the total number of pages,
 * and the total number of elements in the entire result set.
 * </p>
 * <p>
 * This class is typically used in conjunction with Spring Data JPA or similar frameworks to
 * provide paginated results for client applications.
 * </p>
 *
 * @see ArchivalRecord
 */
@Data
public class ArchivalRecordPage extends BasePage<ArchivalRecord> {


    /**
     * Default constructor.
     */
    public ArchivalRecordPage(){}

    /**
     * Parameterized constructor to initialize the ArchivalRecordPage with content, page size, and total elements.
     *
     * @param _content       The list of {@link ArchivalRecord} entities in the current page.
     * @param _pageSize      The size of each page.
     * @param _totalElements The total number of elements in the entire result set.
     */
    public ArchivalRecordPage(List<ArchivalRecord> _content, int _pageSize, long _totalElements){
        super(_content, _pageSize, _totalElements);
    }


}
