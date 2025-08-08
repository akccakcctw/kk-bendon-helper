import { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { translations, SupportedLocale } from '../lib/translations';
import './styles.scss';

const Popup = () => {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [slackId, setSlackId] = useState('');
  const [staffId, setStaffId] = useState('');
  const manifest = browser.runtime.getManifest();

  // Load all settings from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await browser.storage.sync.get({
        locale: browser.i18n.getUILanguage(),
        lastname: '',
        email: '',
        slackId: '',
        staffId: '',
      });
      const l = (settings.locale as string).startsWith('zh') ? 'zh-TW' : 'en';
      setLocale(l);
      setLastname(settings.lastname as string);
      setEmail(settings.email as string);
      setSlackId(settings.slackId as string);
      setStaffId(settings.staffId as string);
    };
    loadSettings();
  }, []);

  // Generic handler to update state and storage
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setter(value);
    browser.storage.sync.set({ [key]: value });
  };

  const handleFillForm = async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      browser.tabs.sendMessage(tab.id, {
        action: 'fill_form',
        data: { lastname, email, slackId, staffId },
      }).catch(e => console.error("Error sending message:", e));
    }
  };

  const openWebPage = (url: string) => browser.tabs.create({ url });

  const t = translations[locale] || translations.en;

  return (
    <section id="popup">
      <h2 className="main-title">{t.popupTitle}</h2>
      <ul>
        <li><span className="text-mono">version: v{manifest.version}</span></li>
        <li><span className="text-mono">author: {manifest.author}</span></li>
      </ul>
      <button type="button" className="button" onClick={() => openWebPage('https://kkdayclub.rezio.shop/')}>
        {t.bendonSystemLink}
      </button>
      <div className="filed-container">
        <div className="field-set">
          <label>{t.lastNameLabel}</label>
          <input onChange={handleInputChange(setLastname, 'lastname')} value={lastname} type="text" />
        </div>
        <div className="field-set">
          <label>{t.emailLabel}</label>
          <input onChange={handleInputChange(setEmail, 'email')} value={email} type="email" />
        </div>
        <div className="field-set">
          <label>{t.slackIdLabel}</label>
          <input onChange={handleInputChange(setSlackId, 'slackId')} value={slackId} type="text" />
        </div>
        <div className="field-set">
          <label>{t.staffIdLabel}</label>
          <input onChange={handleInputChange(setStaffId, 'staffId')} value={staffId} type="text" />
        </div>
      </div>
      <button type="button" className="button button-primary" onClick={handleFillForm}>
        {t.fillForm} ✨
      </button>
    </section>
  );
};

export default Popup;