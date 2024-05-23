export {}
/*import { renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import useKeyboardShortcut from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  it('should call callback when the shortcut key is pressed and target is not an input or textarea', () => {
    const callback = jest.fn();
    const shortcutKey = 'Enter';
    renderHook(() => useKeyboardShortcut(shortcutKey, callback));

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback when the shortcut key is pressed and target is an input element', () => {
    const callback = jest.fn();
    const shortcutKey = 'Enter';
    const input = document.createElement('input');
    document.body.appendChild(input);

    renderHook(() => useKeyboardShortcut(shortcutKey, callback));

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when the shortcut key is pressed and target is a textarea element', () => {
    const callback = jest.fn();
    const shortcutKey = 'Enter';
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    renderHook(() => useKeyboardShortcut(shortcutKey, callback));

    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback with correct viewer object when provided', () => {
    const callback = jest.fn();
    const shortcutKey = 'Enter';
    renderHook(() => useKeyboardShortcut(shortcutKey, callback));

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(callback).toHaveBeenCalled();
  });
});
*/
