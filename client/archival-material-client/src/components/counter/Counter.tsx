import React, { useState } from 'react';


import styles from './Counter.module.scss';
import useCounterActions from '../../store/couter/hooks/counterActionHook';
import useCounterSelector from '../../store/couter/hooks/counterSelectorHook';


export function Counter() {
  const counterActions = useCounterActions();
  const counterSelectors = useCounterSelector();
  const [incrementAmount, setIncrementAmount] = useState<number>(2);

  return (
    <div>
      <p>{counterSelectors.status}</p>
      <p>{counterSelectors.errorMessage}</p>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => {counterActions.decrement()}}
        >
          -
        </button>
        <span className={styles.value}>{counterSelectors.count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => counterActions.increment()}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
        />
        <button
          className={styles.button}
          onClick={() => counterActions.increment(incrementAmount)}
        >
          Add Amount
        </button>
        <button
          className={`${styles.button} ${styles.AsyncButton}`}
          onClick={() => counterActions.incrementAsync(incrementAmount)}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => counterActions.incrementIfOdd(incrementAmount)}
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
}
