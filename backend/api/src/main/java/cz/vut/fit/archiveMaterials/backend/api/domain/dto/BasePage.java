package cz.vut.fit.archiveMaterials.backend.api.domain.dto;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import lombok.Data;

import java.util.List;

@Data
public class BasePage<T> {

    /**
     * Default constructor.
     */
    public BasePage(){}

    /**
     * Parameterized constructor to initialize the ArchivalRecordPage with content, page size, and total elements.
     *
     * @param _content       The list of entities in the current page.
     * @param _pageSize      The size of each page.
     * @param _totalElements The total number of elements in the entire result set.
     */
    public BasePage(List<T> _content, int _pageSize, long _totalElements){
        this.setContent(_content);
        this.setTotalPages(_totalElements, _pageSize);
        this.setTotalElements(_totalElements);
    }

    /**
     * The list of {@link ArchivalRecord} entities in the current page.
     */
    private List<T> content;

    /**
     * The total number of pages in the result set based on the specified page size.
     */
    private int totalPages;

    /**
     * The total number of elements in the entire result set.
     */
    private long totalElements;


    /**
     * Sets the total number of pages based on the total number of records and the specified page size.
     *
     * @param totalRecords The total number of records in the entire result set.
     * @param pageSize     The size of each page.
     */
    public void setTotalPages(long totalRecords, Integer pageSize){
        int windowSize = 100000; // Elasticsearch's maximum result window size
        long limitedTotalRecords = Math.min(totalRecords, windowSize);
        this.totalPages = (int) Math.ceil((double) limitedTotalRecords / pageSize);

        //this.totalPages = (int) Math.ceil((double) totalRecords / pageSize);
    }
}
