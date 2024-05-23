import counterSelector from '../../../store/couter/counterSelector';
import { useAppSelector } from '../../../store/hooks';

const useCounterSelector = () => {

  return { 
    count: useAppSelector(counterSelector.getCounterValue),
    status: useAppSelector(counterSelector.getCounterStatus),
    errorMessage: useAppSelector(counterSelector.getErrorMessage),

   };
};

export default useCounterSelector;