import { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { translations, SupportedLocale } from '../lib/translations';

const ALARM_NAME = 'buyLunchReminder';

const Options = () => {
  // State for all settings
  const [day, setDay] = useState('3');
  const [time, setTime] = useState('12:00');
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [slackId, setSlackId] = useState('');
  const [staffId, setStaffId] = useState('');
  
  const [status, setStatus] = useState('');
  const [alarmInfo, setAlarmInfo] = useState('');

  const t = translations[locale] || translations.en;

  const updateAlarmInfo = async () => {
    const alarm = await browser.alarms.get(ALARM_NAME).catch(e => console.error(e));
    if (alarm) {
      const d = new Date(alarm.scheduledTime);
      setAlarmInfo(`${t.currentReminder} ${d.toLocaleString(locale, { weekday: 'long', hour: 'numeric', minute: 'numeric' })}`);
    } else {
      setAlarmInfo(t.noReminder);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await browser.storage.sync.get({
        reminderDay: '3',
        reminderTime: '12:00',
        locale: browser.i18n.getUILanguage(),
        lastname: '',
        email: '',
        slackId: '',
        staffId: '',
      });
      const l = (settings.locale as string).startsWith('zh') ? 'zh-TW' : 'en';
      setLocale(l);
      setDay(settings.reminderDay as string);
      setTime(settings.reminderTime as string);
      setLastname(settings.lastname as string);
      setEmail(settings.email as string);
      setSlackId(settings.slackId as string);
      setStaffId(settings.staffId as string);
    };
    loadSettings().then(updateAlarmInfo);
  }, []);

  const handleSave = async () => {
    await browser.storage.sync.set({
      reminderDay: day, reminderTime: time, locale, lastname, email, slackId, staffId
    });
    setStatus(t.settingsSaved);
    setTimeout(updateAlarmInfo, 200);
    setTimeout(() => setStatus(''), 3000);
  };

  const handleTestNotification = () => browser.runtime.sendMessage({ action: 'testNotification' });

  return (
    <div className="options-container">
      <header className="options-header"><h1>{t.pageTitle}</h1></header>
      <main>
        <section className="settings-card">
          <div className="card-header"><h2>{t.userDataCardTitle}</h2><p>{t.userDataCardDescription}</p></div>
          <div className="card-body">
            <div className="setting-row"><label className="setting-label">{t.lastNameLabel}</label><input className="setting-control" value={lastname} onChange={(e) => setLastname(e.target.value)} /></div>
            <div className="setting-row"><label className="setting-label">{t.emailLabel}</label><input type="email" className="setting-control" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="setting-row"><label className="setting-label">{t.slackIdLabel}</label><input className="setting-control" value={slackId} onChange={(e) => setSlackId(e.target.value)} /></div>
            <div className="setting-row"><label className="setting-label">{t.staffIdLabel}</label><input className="setting-control" value={staffId} onChange={(e) => setStaffId(e.target.value)} /></div>
          </div>
        </section>

        <section className="settings-card">
          <div className="card-header"><h2>{t.languageCardTitle}</h2><p>{t.languageCardDescription}</p></div>
          <div className="card-body">
            <div className="setting-row"><label className="setting-label">{t.languageLabel}</label><select className="setting-control" value={locale} onChange={(e) => setLocale(e.target.value as SupportedLocale)}><option value="en">English</option><option value="zh-TW">繁體中文</option></select></div>
          </div>
        </section>

        <section className="settings-card">
          <div className="card-header"><h2>{t.reminderCardTitle}</h2><p>{t.reminderCardDescription}</p></div>
          <div className="card-body">
            {alarmInfo && <div className="info-box">{alarmInfo}</div>}
            <div className="setting-row"><label className="setting-label">{t.dayLabel}</label><select className="setting-control" value={day} onChange={(e) => setDay(e.target.value)}><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option></select></div>
            <div className="setting-row"><label className="setting-label">{t.timeLabel}</label><input type="time" className="setting-control" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          </div>
        </section>

        <div className="card-footer-sticky">
          {status && <div className="status-message">{status}</div>}
          <button onClick={handleTestNotification} className="btn btn-secondary">{t.testButton}</button>
          <button onClick={handleSave} className="btn btn-primary">{t.saveButton}</button>
        </div>
      </main>
    </div>
  );
};

export default Options;
