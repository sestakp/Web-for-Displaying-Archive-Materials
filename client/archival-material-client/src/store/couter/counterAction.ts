import { createAction } from '@reduxjs/toolkit';
import CounterTypes from './counterType';
import AppThunk from '../types/appThunk';
import Status from '../types/status';
import logger from '../../utils/loggerUtil';



/*
  this: { type: CounterTypes.INCREMENT, payload: amount}
  is equal to this: createAction<number>(CounterTypes.INCREMENT)(amount)
  */

const DEFAULT_INCREMENT_AMOUNT = 1;

const setStatus = (status: Status, errorMessage: string | undefined = undefined):AppThunk => (dispatch) => {
  
  if(status === Status.FAILED && errorMessage !== undefined){
    dispatch(createAction<String>(CounterTypes.SET_ERROR_MESSAGE)(errorMessage))
  }
  else{
    dispatch(createAction<String>(CounterTypes.SET_ERROR_MESSAGE)(""))
  }

  return dispatch(createAction<Status>(CounterTypes.SET_STATUS)(status))
}

const counterAction = {

  increment: (amount:number = DEFAULT_INCREMENT_AMOUNT): AppThunk => (dispatch) => {
    dispatch(setStatus(Status.IDLE))
    return dispatch(createAction<number>(CounterTypes.INCREMENT)(amount))
  },

  decrement: (amount:number = DEFAULT_INCREMENT_AMOUNT): AppThunk => (dispatch) => {
    dispatch(setStatus(Status.IDLE))
    return dispatch(createAction<number>(CounterTypes.DECREMENT)(amount))
  },

  incrementIfOdd: (amount:number = DEFAULT_INCREMENT_AMOUNT): AppThunk => (dispatch, getState) => {
    if(getState().counter.value % 2 === 1){
      dispatch(setStatus(Status.IDLE))
      return dispatch(createAction<number>(CounterTypes.INCREMENT)(amount))
    }
  },

  incrementAsync: (amount: number): AppThunk => (dispatch) => {
    // Add async logic here if needed
    dispatch(setStatus(Status.LOADING))

      return new Promise((resolve) => {
        resolve(setTimeout(async() => {
          try{

            await dispatch(createAction<number>(CounterTypes.INCREMENT)(amount));
            throw new Error("fake error")
            //dispatch(setStatus(Status.IDLE))
          }
          catch(e: any){
            logger.debug("e: ", e.message)
            dispatch(setStatus(Status.FAILED, e.message))
          }
        }, 1000));
      });
  }
}

export default counterAction;
