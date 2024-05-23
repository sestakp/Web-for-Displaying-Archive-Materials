import TypeOfRecordEnum from "./TypeOfRecordEnum";

export default interface ArchivalCategory{
    name: string;
    icon: string;
    description: string;
    type: TypeOfRecordEnum;
    linkName: string;
}