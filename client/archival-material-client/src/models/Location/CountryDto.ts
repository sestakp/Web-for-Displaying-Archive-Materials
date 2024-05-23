import RegionDto from "./RegionDto";



export default interface CountryDto{
    name: string;
    regions: RegionDto[];
}