import { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

const Options = () => {
  const [day, setDay] = useState('3');
  const [time, setTime] = useState('12:00');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const items = await browser.storage.sync.get({
          reminderDay: '3',
          reminderTime: '12:00'
        });
        // Safely cast the retrieved properties to string before setting state
        setDay(items.reminderDay as string);
        setTime(items.reminderTime as string);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await browser.storage.sync.set({
        reminderDay: day,
        reminderTime: time
      });
      setStatus('Settings saved!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setStatus('Error saving settings.');
    }
  };

  const handleTestNotification = () => {
    browser.runtime.sendMessage({ action: 'testNotification' });
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>Bendon Helper Settings</h1>
      </header>

      <main>
        <section className="settings-card">
          <div className="card-header">
            <h2>Reminder Settings</h2>
            <p>Set the time for your weekly lunch reminder.</p>
          </div>
          <div className="card-body">
            <div className="setting-row">
              <label htmlFor="day-select" className="setting-label">Day of the week</label>
              <select id="day-select" className="setting-control" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
              </select>
            </div>
            <div className="setting-row">
              <label htmlFor="time-input" className="setting-label">Time</label>
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
              Test Notification
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Options;