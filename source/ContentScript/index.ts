import browser from 'webextension-polyfill';
import { setReactInputValue } from './utils';

console.log('Bendon Helper content script loaded.');

/**
 * The data structure for the fields in the BenDon system.
 */
interface BenDonFields {
  lastname: string;
  email: string;
  slackId: string;
  staffId: string;
}

/**
 * The structure of the message received from the popup.
 */
interface FillFormRequest {
  action: 'fill_form';
  data: BenDonFields;
}

const SLACK_ID_SELECTOR = 'input[id*="e873c5e4-eb8e-4029-8efe-20cb83071f41"], input[name*="e873c5e4-eb8e-4029-8efe-20cb83071f41"]';
const STAFF_ID_SELECTOR = 'input[id*="d111470c-31c7-4280-89d6-acf60e38f53e"], input[name*="d111470c-31c7-4280-89d6-acf60e38f53e"]';

// Listen for messages from the popup or background script
browser.runtime.onMessage.addListener((request: unknown, _sender: browser.Runtime.MessageSender) => {
  // Type guard to ensure the request is the one we expect
  if (typeof request === 'object' && request !== null && 'action' in request && request.action === 'fill_form') {
    const fillRequest = request as FillFormRequest;
    console.log('Received fill_form request', fillRequest.data);

    const { lastname, email, slackId, staffId } = fillRequest.data;

    // Helper to find a single input element
    function getInputElement(query: string): HTMLInputElement | null {
      const element = document.querySelector(query);
      return element instanceof HTMLInputElement ? element : null;
    }

    // Helper to find multiple input elements
    function getInputElementList(query: string): HTMLInputElement[] {
      return Array.from(document.querySelectorAll(query)).filter(
        (el): el is HTMLInputElement => el instanceof HTMLInputElement
      );
    }

    // Last Name
    const lastNameInput = getInputElement('input[autocomplete="family-name"]');
    if (lastNameInput && lastname) {
      setReactInputValue(lastNameInput, lastname);
    }

    // Email
    const emailInput = getInputElement('input[autocomplete="email"]');
    if (emailInput && email) {
      setReactInputValue(emailInput, email);
    }

    // Slack ID
    const slackIdInputList = getInputElementList(SLACK_ID_SELECTOR);
    if (slackId) {
      slackIdInputList.forEach((input) => setReactInputValue(input, slackId));
    }

    // Staff ID
    const staffIdInputList = getInputElementList(STAFF_ID_SELECTOR);
    if (staffId) {
      staffIdInputList.forEach((input) => setReactInputValue(input, staffId));
    }

    // Return a promise to indicate an async response
    return Promise.resolve({ status: 'success', filled: { lastname, email, slackId, staffId } });
  }
  // Return false or undefined to indicate we are not handling this message
  return false;
});

export {};
