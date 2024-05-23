package cz.vut.fit.archiveMaterials.backend.core.utils;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.StringReader;

public class JsonParseUtil {

    public static JsonObject parseJson(String jsonString) {
        // Create a StringReader from the JSON string
        StringReader stringReader = new StringReader(jsonString);

        // Use JsonReader to parse the JSON string
        try (JsonReader jsonReader = Json.createReader(stringReader)) {
            // Parse the JSON and return the JsonObject
            return jsonReader.readObject();
        }
    }
}
