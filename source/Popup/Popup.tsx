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

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await browser.storage.sync.get({
        locale: browser.i18n.getUILanguage(),
        lastname: '', email: '', slackId: '', staffId: '',
      });
      const l = (settings.locale as string).startsWith('zh') ? 'zh-TW' : 'en';
      setLocale(l);
      setLastname(settings.lastname as string);
      setEmail(settings.email as string);
      setSlackId(settings.slackId as string);
      setStaffId(settings.staffId as string);
    };
    loadSettings();

    const handleStorageChange = (changes: { [key: string]: browser.Storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync') {
        if (changes.locale) setLocale((changes.locale.newValue as string).startsWith('zh') ? 'zh-TW' : 'en');
        if (changes.lastname) setLastname(changes.lastname.newValue as string);
        if (changes.email) setEmail(changes.email.newValue as string);
        if (changes.slackId) setSlackId(changes.slackId.newValue as string);
        if (changes.staffId) setStaffId(changes.staffId.newValue as string);
      }
    };
    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setter(value);
    browser.storage.sync.set({ [key]: value });
  };

  const handleFillForm = async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      browser.tabs.sendMessage(tab.id, { action: 'fill_form', data: { lastname, email, slackId, staffId } });
    }
  };

  const openWebPage = (url: string) => browser.tabs.create({ url });
  const openOptionsPage = () => browser.runtime.openOptionsPage();

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

      <button type="button" className="button button-primary" onClick={handleFillForm}>{t.fillForm} ✨</button>

      <div className="bottom-controls">
        <button type="button" className="button-link" onClick={openOptionsPage}>{t.goToOptions} →</button>
      </div>
    </section>
  );
};

export default Popup;
