/**
 * Sets the value of a React-controlled input element and dispatches the necessary events
 * to ensure the change is recognized by the framework.
 *
 * @param element The input element to update.
 * @param value The value to set.
 */
export function setReactInputValue(element: HTMLInputElement, value: string): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;

  if (!nativeInputValueSetter) {
    // Fallback for environments where the setter is not available
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  nativeInputValueSetter.call(element, value);

  // Dispatch an 'input' event to simulate user input
  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);
}
