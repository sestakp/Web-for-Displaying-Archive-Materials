package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.dto.*;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class UserDtoMapper {

    public abstract AuthUser map(AuthRequestDto dto);

    public abstract AuthResponseDto mapAuth(AuthUser user);

    public abstract User map(RegisterRequestDto dto);

    public abstract RegisterResponseDto map(User user);

    public abstract User map(UserUpdateDto user);

    public abstract UserDetailDto mapToDetail(User user);

}
