import * as React from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';

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
  browser.tabs.executeScript({
    code: `(function() {
      const { lastname, email, slackId, staffId} = ${JSON.stringify(fields)};

      function getInputElement(query) {
        return document.querySelector(query);
      }
      function getInputElementList(query) {
        return document.querySelectorAll(query);
      }

      // Last Name
      const lastNameInput = getInputElement(
        'input[name*="adefb4ec-b408-4f5e-b71d-d1c79599cdbc"]'
      );
      if (lastNameInput) {
        lastNameInput.value = lastname;
      }
      // Email
      const emailInput = getInputElement(
        'input[name*="bb3b43f7-996d-4e86-97b3-ffff35032e9a"]'
      );
      if (emailInput) {
        emailInput.value = email;
      }
      // Slack ID
      const slackIdInputList = getInputElementList(
        'input[name*="e873c5e4-eb8e-4029-8efe-20cb83071f41"]'
      );
      if (slackIdInputList.length > 0) {
        slackIdInputList.forEach(
          (input) => (input.value = slackId)
        );
      }
      // Staff ID
      const staffIdInputList = getInputElementList(
        'input[name*="d111470c-31c7-4280-89d6-acf60e38f53e"]'
      );
      if (staffIdInputList.length > 0) {
        staffIdInputList.forEach(
          (input) => ((input).value = staffId)
        );
      }

    })()`,
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
      const lastnameCache = await browser.storage.local.get('lastname');
      const emailCache = await browser.storage.local.get('email');
      const slackIdCache = await browser.storage.local.get('slackId');
      const staffIdCache = await browser.storage.local.get('staffId');

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
