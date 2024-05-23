import { AnyAction } from '@reduxjs/toolkit';
import CounterTypes from './counterType';
import CounterState from './counterState/counterStateInterface';
import counterDefaultState from './counterState/counterDefaultState';


const counterReducer = (state: CounterState = counterDefaultState, action: AnyAction): CounterState => {
  switch (action.type) {
    case CounterTypes.INCREMENT:
      return { ...state, value: state.value + action.payload };
    case CounterTypes.DECREMENT:
      return { ...state, value: state.value - action.payload };
    case CounterTypes.SET_STATUS:
      return { ...state, status: action.payload }
    case CounterTypes.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload }
    default:
      return state;
  }
};

export default counterReducer;