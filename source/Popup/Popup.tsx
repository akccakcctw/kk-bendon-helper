import * as React from 'react';
import browser, { type Tabs } from 'webextension-polyfill';

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
      browser.tabs.sendMessage(activeTab.id, {
        action: 'fill_form',
        data: fields,
      }).then(response => {
        if (browser.runtime.lastError) {
          console.error(browser.runtime.lastError);
        } else {
          console.log('Response from content script:', response);
        }
      }).catch(error => {
        console.error('Error sending message to content script:', error);
        // This can happen if the content script is not yet injected.
        // You might want to alert the user or implement a retry mechanism.
        alert('Could not connect to the content script. Please refresh the page and try again.');
      });
    }
  });
}

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
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
              browser.storage.local.set({ lastname: val });
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
              browser.storage.local.set({ email: text });
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
              browser.storage.local.set({ slackId: val });
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
              browser.storage.local.set({ staffId: val });
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
