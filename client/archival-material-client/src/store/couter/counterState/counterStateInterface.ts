import Status from "../../types/status";


export default interface CounterState {
    value: number;
    status: Status;
    errorMessage: String;
}
