package cz.vut.fit.archiveMaterials.backend.api.domain.comparers;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;

import java.util.Comparator;

public class ScanComparator implements Comparator<Scan> {

    @Override
    public int compare(Scan scan1, Scan scan2) {
        // Assuming orderNumber is an Integer field in the Scan class
        return scan1.getOrderNumber().compareTo(scan2.getOrderNumber());
    }
}
