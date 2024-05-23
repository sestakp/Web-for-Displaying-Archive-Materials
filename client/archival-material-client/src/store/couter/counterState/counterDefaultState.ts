import Status from "../../types/status";
import CounterState from "./counterStateInterface";



const counterDefaultState: CounterState = {
    value: 0,
    status: Status.IDLE,
    errorMessage: "",
};

export default counterDefaultState