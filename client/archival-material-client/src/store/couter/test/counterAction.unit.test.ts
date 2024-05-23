import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import counterAction from '../counterAction'; // Replace with your actual file name
import CounterTypes from '../counterType';
import counterDefaultState from '../counterState/counterDefaultState';
import RootState from '../../types/rootState';
import Status from '../../types/status';
import archivalRecordDefaultState from '../../archivalRecord/archivalRecordState/archivalRecordDefaultState';
import userDefaultState from '../../user/userState/userDefaultState';
import noteDefaultState from '../../note/noteState/noteDefaultState';
import bookmarkDefaultState from '../../bookmark/bookmarkState/bookmarkDefaultState';
import archiveDefaultState from '../../archive/archiveState/archiveDefaultState';
import locationDefaultState from '../../location/locationState/locationDefaultState';
const middlewares = [thunk];
const mockStore = configureMockStore<RootState>(middlewares);

describe('counterAction', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({ counter: counterDefaultState, archivalRecord: archivalRecordDefaultState, user: userDefaultState, note: noteDefaultState, bookmark: bookmarkDefaultState, archive: archiveDefaultState, location: locationDefaultState });
  });

  it('should dispatch increment action', async () => {
    await store.dispatch<any>(await counterAction.increment());
    const actions = store.getActions();    
    expect(actions).toContainEqual({ type: CounterTypes.INCREMENT, payload: 1 });
  });

  it('should dispatch decrement action', () => {
    store.dispatch<any>(counterAction.decrement());
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: CounterTypes.DECREMENT, payload: 1 });
  });

  it('should dispatch incrementIfOdd action if count is odd', () => {
    store = mockStore({ counter: { value: 1, status: Status.IDLE, errorMessage: "" }, archivalRecord: archivalRecordDefaultState, user: userDefaultState, note: noteDefaultState, bookmark: bookmarkDefaultState, archive: archiveDefaultState, location: locationDefaultState }); // Set an odd value
    store.dispatch<any>(counterAction.incrementIfOdd());
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: CounterTypes.INCREMENT, payload: 1 });
  });

  it('should not dispatch incrementIfOdd action if count is even', () => {
    store.dispatch<any>(counterAction.incrementIfOdd());
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('should dispatch incrementAsync action after delay', async () => {
    jest.useFakeTimers();
    const promise = store.dispatch<any>(counterAction.incrementAsync(2));
    jest.runAllTimers();
    await promise;
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: CounterTypes.INCREMENT, payload: 2 });
  });
});
