import formatTimeRange from "./formatters/formatTimeRange";
import isTimeRange from "./isTimeRange";







export default function displayValue(value: any): string{
        
    if (typeof value !== 'object' && value !== null) {

        if(value == false){
            return "Ne"
        }
        else if(value == true){
            return "Ano"
        }
        
        return value.toString(); // or any other logic to handle non-object values
    }

    if (Array.isArray(value)) {
        // Handle arrays by joining each element with a newline
        if(value.length > 0){
            return value.map(displayValue).join('\n');
        }
    }

    if (isTimeRange(value)) {
        
        const valueStr = formatTimeRange(value);
        if(valueStr != null){
            return valueStr
        }
        
    }

    let objValueStr = ""
    if (value?.hasOwnProperty("name") && value.name != undefined) {
        objValueStr = "Název: " + value.name.toString();
    }

    if (value?.hasOwnProperty("type") && value.type != undefined) {
        if(objValueStr != ""){
            objValueStr += "\n";
        }
        objValueStr += "Typ: " + value.type.toString();
    }

    if (value?.hasOwnProperty("code") && value.code != undefined) {
        if(objValueStr != ""){
            objValueStr += "\n";
        }
        objValueStr += "Číslo fondu: " + value.code.toString();
    }

    if(objValueStr != ""){
        return objValueStr;
    }


    return "placeholder"
}