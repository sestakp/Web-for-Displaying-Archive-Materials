package cz.vut.fit.archiveMaterials.backend.api.domain.dto;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.BasePage;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;

import java.util.List;

public class LocationPage extends BasePage<Location> {

    public LocationPage(List<Location> _content, int _pageSize, long _totalElements){
        super(_content, _pageSize, _totalElements);
    }
}
