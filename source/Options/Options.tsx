import { useState, useEffect } from 'react';

const Options = () => {
  const [day, setDay] = useState('3');
  const [time, setTime] = useState('12:00');
  const [status, setStatus] = useState('');

  useEffect(() => {
    chrome.storage.sync.get({
      reminderDay: '3',
      reminderTime: '12:00'
    }, (items: { [key: string]: string }) => {
      setDay(items.reminderDay);
      setTime(items.reminderTime);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({
      reminderDay: day,
      reminderTime: time
    }, () => {
      setStatus('設定已儲存！');
      setTimeout(() => setStatus(''), 3000);
    });
  };

  const handleTestNotification = () => {
    chrome.runtime.sendMessage({ action: 'testNotification' });
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>訂便當小幫手設定</h1>
      </header>

      <main>
        <section className="settings-card">
          <div className="card-header">
            <h2>提醒設定</h2>
            <p>設定每週接收便當提醒的時間。</p>
          </div>
          <div className="card-body">
            <div className="setting-row">
              <label htmlFor="day-select" className="setting-label">每週</label>
              <select id="day-select" className="setting-control" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="1">星期一</option>
                <option value="2">星期二</option>
                <option value="3">星期三</option>
                <option value="4">星期四</option>
                <option value="5">星期五</option>
              </select>
            </div>
            <div className="setting-row">
              <label htmlFor="time-input" className="setting-label">時間</label>
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
              測試通知
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              儲存設定
            </button>
          </div>
        </section>

        {/* 未來可以輕鬆地在這裡加入新的設定卡片 */}
        {/*
        <section className="settings-card">
          <div className="card-header">
            <h2>另一個設定</h2>
          </div>
          <div className="card-body">
            ...
          </div>
        </section>
        */}
      </main>
    </div>
  );
};

export default Options;