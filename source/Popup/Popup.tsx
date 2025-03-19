import * as React from 'react';
import browser, {type Tabs} from 'webextension-polyfill';

import './styles.scss';

/**
 * 便當系統的欄位
 */
interface BenDonFields {
  lastname: string;
  email: string;
  slackId: string;
  staffId: string;
}

function handleFillFields(fields: BenDonFields): void {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const activeTab = tabs[0];
    if (activeTab?.id) {
      browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (fields: BenDonFields) => {
          const { lastname, email, slackId, staffId } = fields;

          function getInputElement(query: string): HTMLInputElement | null {
            const element = document.querySelector(query);
            return element instanceof HTMLInputElement ? element : null;
          }

          function getInputElementList(query: string): HTMLInputElement[] {
            return Array.from(document.querySelectorAll(query)).filter(
              (el): el is HTMLInputElement => el instanceof HTMLInputElement
            );
          }

          // Last Name
          const lastNameInput = getInputElement('input[autocomplete="family-name"]');
          if (lastNameInput) {
            lastNameInput.value = lastname;
          }

          // Email
          const emailInput = getInputElement('input[autocomplete="email"]');
          if (emailInput) {
            emailInput.value = email;
          }

          // Slack ID
          const slackIdInputList = getInputElementList(
            'input[id*="e873c5e4-eb8e-4029-8efe-20cb83071f41"], input[name*="e873c5e4-eb8e-4029-8efe-20cb83071f41"]'
          );
          slackIdInputList.forEach((input) => (input.value = slackId));

          // Staff ID
          const staffIdInputList = getInputElementList(
            'input[id*="d111470c-31c7-4280-89d6-acf60e38f53e"], input[name*="d111470c-31c7-4280-89d6-acf60e38f53e"]'
          );
          staffIdInputList.forEach((input) => (input.value = staffId));
        },
        args: [fields],
      });
    }
  });
}

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

const Popup: React.FC = () => {
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [slackId, setSlackId] = React.useState('');
  const [staffId, setStaffId] = React.useState('');

  React.useEffect(() => {
    (async function getCache(): Promise<void> {
      const lastnameCache = await browser.storage.local.get('lastname') as { lastname: string };
      const emailCache = await browser.storage.local.get('email') as { email: string };
      const slackIdCache = await browser.storage.local.get('slackId') as { slackId: string };
      const staffIdCache = await browser.storage.local.get('staffId') as { staffId: string };

      if (lastnameCache) setLastname(lastnameCache.lastname);
      if (emailCache) setEmail(emailCache.email);
      if (slackIdCache) setSlackId(slackIdCache.slackId);
      if (staffIdCache) setStaffId(staffIdCache.staffId);
    })();
  }, []);

  return (
    <section id="popup">
      <h2 className="main-title">訂便當小幫手</h2>
      <ul>
        <li>
          <span className="text-mono">version: v{process.env.VERSION}</span>
        </li>
        <li>
          <span className="text-mono">author: {process.env.AUTHOR}</span>
        </li>
      </ul>
      <button
        type="button"
        className="button"
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage('https://kkdayclub.rezio.shop/');
        }}
      >
        便當系統 🔗
      </button>
      <div className="filed-container">
        <div className="field-set">
          <label>Lastname</label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const val = e.currentTarget.value;
              setLastname(val);
              browser.storage.local.set({lastname: val});
            }}
            value={lastname}
            name="lastname"
            type="text"
          />
        </div>
        <div className="field-set">
          <label>Email</label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const text = e.currentTarget.value;
              setEmail(text);
              browser.storage.local.set({email: text});
            }}
            value={email}
            name="email"
            type="email"
          />
        </div>
        <div className="field-set">
          <label>Slack ID</label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const val = e.currentTarget.value;
              setSlackId(val);
              browser.storage.local.set({slackId: val});
            }}
            value={slackId}
            name="slack-id"
            type="text"
          />
        </div>
        <div className="field-set">
          <label>Staff ID</label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const val = e.currentTarget.value;
              setStaffId(val);
              browser.storage.local.set({staffId: val});
            }}
            value={staffId}
            name="staff-id"
            type="text"
          />
        </div>
      </div>
      <button
        type="button"
        className="button"
        onClick={(): void => {
          return handleFillFields({
            lastname,
            email,
            slackId,
            staffId,
          });
        }}
      >
        填入所有欄位 ✨
      </button>
    </section>
  );
};

export default Popup;
