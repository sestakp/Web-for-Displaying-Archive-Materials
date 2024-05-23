package cz.vut.fit.archiveMaterials.backend.api.domain.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AuthUser map(User source);
}
