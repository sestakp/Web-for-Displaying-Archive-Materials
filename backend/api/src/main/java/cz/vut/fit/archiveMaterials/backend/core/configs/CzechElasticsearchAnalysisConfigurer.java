package cz.vut.fit.archiveMaterials.backend.core.configs;

import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurationContext;
import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurer;
import org.springframework.stereotype.Component;

/**
 * Component providing custom Elasticsearch analysis configuration for Czech language.
 */
@Component
public class CzechElasticsearchAnalysisConfigurer implements ElasticsearchAnalysisConfigurer {

    /**
     * Configures the Elasticsearch analysis settings for the Czech language.
     *
     * @param context The Elasticsearch analysis configuration context.
     */
    @Override
    public void configure(ElasticsearchAnalysisConfigurationContext context)  {
        context.analyzer("czech").custom()
                .tokenizer("standard")
                .tokenFilters("lowercase",
                        "czech_stemmer",
                        "asciifolding",
                        "czech_grammar_normalizer_i", //remove vocal assimilation
                        "czech_grammar_normalizer_d",
                        "czech_grammar_normalizer_s",
                        "czech_grammar_normalizer_p",
                        "czech_grammar_normalizer_v",
                        "czech_grammar_normalizer_g",
                        "czech_grammar_normalizer_ch",
                        "czech_grammar_normalizer_w");

        context.analyzer("autocomplete").custom()
                        .tokenizer("standard")
                        .tokenFilters("lowercase","asciifolding", "autocomplete_filter");

        context.tokenFilter("autocomplete_filter")
                .type("edge_ngram")
                .param("min_gram", 1)
                .param("max_gram", 20);

        context.normalizer("czech").custom()
                .tokenFilters("lowercase", "asciifolding");


        context.tokenFilter("czech_stemmer")
                .type("stemmer")
                .param("language", "czech");

        //remove vocal assimilation
        context.tokenFilter("czech_grammar_normalizer_i")
                .type("pattern_replace")
                .param("pattern", "i")
                .param("replacement", "y");

        context.tokenFilter("czech_grammar_normalizer_d")
                .type("pattern_replace")
                .param("pattern", "d")
                .param("replacement", "t");

        context.tokenFilter("czech_grammar_normalizer_s")
                .type("pattern_replace")
                .param("pattern", "s")
                .param("replacement", "z");

        context.tokenFilter("czech_grammar_normalizer_p")
                .type("pattern_replace")
                .param("pattern", "p")
                .param("replacement", "b");

        context.tokenFilter("czech_grammar_normalizer_v")
                .type("pattern_replace")
                .param("pattern", "v")
                .param("replacement", "f");

        context.tokenFilter("czech_grammar_normalizer_g")
                .type("pattern_replace")
                .param("pattern", "g")
                .param("replacement", "k");

        context.tokenFilter("czech_grammar_normalizer_ch")
                .type("pattern_replace")
                .param("pattern", "ch")
                .param("replacement", "h");

        context.tokenFilter("czech_grammar_normalizer_w")
                .type("pattern_replace")
                .param("pattern", "w")
                .param("replacement", "v");
    }
}
