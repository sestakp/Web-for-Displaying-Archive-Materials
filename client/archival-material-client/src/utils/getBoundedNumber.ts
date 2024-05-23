


export default function getBoundedNumber(value:number, min: number, max: number){

    if(value < min){
        value = min
    }
    else if(value > max){
        value = max
    }
    return value


}