package cz.vut.fit.archiveMaterials.backend.api.domain.dto;

import java.util.List;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import lombok.Data;

@Data
public class ScansResult {

    List<Scan> scans;
}
