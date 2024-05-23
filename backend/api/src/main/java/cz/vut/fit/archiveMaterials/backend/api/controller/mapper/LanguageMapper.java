package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class LanguageMapper {

    @Named("mapLanguages")
    public static Collection<Language> mapLanguages(Collection<String> languages) {
        if (languages == null){
            return new ArrayList<>();
        }
        return languages.stream()
                .map(language -> new Language(language))
                .collect(Collectors.toList());
    }

    @Named("mapLanguagesRev")
    public static List<String> mapLanguagesRev(Collection<Language> languages) {
        if (languages == null){
            return new ArrayList<>();
        }
        return languages.stream()
                .map(language -> language.getName())
                .collect(Collectors.toList());
    }

}
