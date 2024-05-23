import { useAppDispatch } from '../../hooks';
import counterAction from '../counterAction';

const useCounterActions = () => {
  const dispatch = useAppDispatch();

  const increment = (amount?: number) => dispatch(counterAction.increment(amount));
  const decrement = (amount?: number) => dispatch(counterAction.decrement(amount));
  const incrementAsync = (amount: number) => dispatch(counterAction.incrementAsync(amount));
  const incrementIfOdd = (amount: number) => dispatch(counterAction.incrementIfOdd(amount));

  return { increment, decrement, incrementAsync, incrementIfOdd };
};

export default useCounterActions;