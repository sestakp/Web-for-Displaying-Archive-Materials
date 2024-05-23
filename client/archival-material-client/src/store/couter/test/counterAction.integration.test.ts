import { createStore, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../rootReducer';
import counterAction from '../counterAction';
// Replace these paths with the actual paths in your project

describe('Integration Test: Counter Reducer', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
  });

  it('should increment the counter', async () => {
    await store.dispatch(counterAction.increment());
    expect(store.getState().counter.value).toEqual(1);
  });

  it('should decrement the counter', async() => {
    await store.dispatch(counterAction.decrement());
    expect(store.getState().counter.value).toEqual(-1);
  });
  
  it('should increment the counter if odd', async() => {
    await store.dispatch(counterAction.incrementIfOdd());
    expect(store.getState().counter.value).toEqual(0);
  });

  it('should increment the counter asynchronously', async () => {
    jest.useFakeTimers();
    const promise =  store.dispatch(counterAction.incrementAsync(2));
    jest.runAllTimers();
    await promise
    expect(store.getState().counter.value).toEqual(2);
  });

  // Add more tests as needed
});