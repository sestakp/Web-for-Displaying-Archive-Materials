import LocationListDto from "./LocationListDto";



export default interface LocationPageDto {

    content: LocationListDto[],
    totalPages: number,
    totalElements: number,
}