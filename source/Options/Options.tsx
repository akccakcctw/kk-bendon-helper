import { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

const ALARM_NAME = 'buyLunchReminder';

const translations = {
  en: {
    pageTitle: 'Bendon Helper Settings',
    reminderCardTitle: 'Reminder Settings',
    reminderCardDescription: 'Set the time for your weekly lunch reminder.',
    currentReminder: 'Next reminder is set for',
    noReminder: 'No reminder is currently set.',
    dayLabel: 'Day of the week',
    timeLabel: 'Time',
    saveButton: 'Save Settings',
    testButton: 'Test Notification',
    settingsSaved: 'Settings saved!',
    languageCardTitle: 'Language',
    languageCardDescription: 'Choose your preferred language.',
    languageLabel: 'Display Language',
  },
  'zh-TW': {
    pageTitle: '訂便當小幫手設定',
    reminderCardTitle: '提醒設定',
    reminderCardDescription: '設定每週接收便當提醒的時間。',
    currentReminder: '下一次提醒時間',
    noReminder: '目前沒有設定提醒。',
    dayLabel: '每週',
    timeLabel: '時間',
    saveButton: '儲存設定',
    testButton: '測試通知',
    settingsSaved: '設定已儲存！',
    languageCardTitle: '語言設定',
    languageCardDescription: '選擇您偏好的顯示語言。',
    languageLabel: '顯示語言',
  },
};

// Define a specific type for our supported locales
type SupportedLocale = keyof typeof translations;

const Options = () => {
  const [day, setDay] = useState('3');
  const [time, setTime] = useState('12:00');
  const [status, setStatus] = useState('');
  const [alarmInfo, setAlarmInfo] = useState('');
  const [locale, setLocale] = useState<SupportedLocale>('en');

  const t = translations[locale] || translations.en;

  const updateAlarmInfo = async () => {
    try {
      const alarm = await browser.alarms.get(ALARM_NAME);
      if (alarm) {
        const scheduledDate = new Date(alarm.scheduledTime);
        const formattedDate = scheduledDate.toLocaleString(locale, {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        setAlarmInfo(`${t.currentReminder} ${formattedDate}.`);
      } else {
        setAlarmInfo(t.noReminder);
      }
    } catch (error) {
      console.error("Error fetching alarm:", error);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await browser.storage.sync.get({
          reminderDay: '3',
          reminderTime: '12:00',
          locale: browser.i18n.getUILanguage(),
        });
        
        const localeSetting = storedSettings.locale as string;
        const currentLocale: SupportedLocale = localeSetting.startsWith('zh') ? 'zh-TW' : 'en';
        
        setLocale(currentLocale);
        setDay(storedSettings.reminderDay as string);
        setTime(storedSettings.reminderTime as string);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings().then(updateAlarmInfo);
  }, []);

  const handleSave = async () => {
    try {
      await browser.storage.sync.set({
        reminderDay: day,
        reminderTime: time,
        locale: locale,
      });
      setStatus(t.settingsSaved);
      setTimeout(updateAlarmInfo, 200);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleTestNotification = () => {
    browser.runtime.sendMessage({ action: 'testNotification' });
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>{t.pageTitle}</h1>
      </header>

      <main>
        <section className="settings-card">
          <div className="card-header">
            <h2>{t.languageCardTitle}</h2>
            <p>{t.languageCardDescription}</p>
          </div>
          <div className="card-body">
            <div className="setting-row">
              <label htmlFor="locale-select" className="setting-label">{t.languageLabel}</label>
              <select id="locale-select" className="setting-control" value={locale} onChange={(e) => setLocale(e.target.value as SupportedLocale)}>
                <option value="en">English</option>
                <option value="zh-TW">繁體中文</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="card-header">
            <h2>{t.reminderCardTitle}</h2>
            <p>{t.reminderCardDescription}</p>
          </div>
          <div className="card-body">
            {alarmInfo && <div className="info-box">{alarmInfo}</div>}
            <div className="setting-row">
              <label htmlFor="day-select" className="setting-label">{t.dayLabel}</label>
              <select id="day-select" className="setting-control" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
              </select>
            </div>
            <div className="setting-row">
              <label htmlFor="time-input" className="setting-label">{t.timeLabel}</label>
              <input
                id="time-input"
                type="time"
                className="setting-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="card-footer">
            {status && <div className="status-message">{status}</div>}
            <button onClick={handleTestNotification} className="btn btn-secondary">
              {t.testButton}
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              {t.saveButton}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Options;
