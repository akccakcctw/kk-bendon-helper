import 'emoji-log';
import browser from 'webextension-polyfill';

const ALARM_NAME = 'buyLunchReminder';

function createOrUpdateAlarm() {
  chrome.storage.sync.get({
    reminderDay: '3',
    reminderTime: '12:00'
  }, (settings: { [key: string]: string }) => {
    const { reminderDay, reminderTime } = settings;
    const [hour, minute] = reminderTime.split(':').map(Number);
    const targetDay = Number(reminderDay);

    const now = new Date();
    const nextAlarmTime = new Date();

    const currentDay = now.getDay();
    let daysUntilTarget = (targetDay - currentDay + 7) % 7;

    nextAlarmTime.setDate(now.getDate() + daysUntilTarget);
    nextAlarmTime.setHours(hour, minute, 0, 0);

    if (daysUntilTarget === 0 && nextAlarmTime.getTime() < now.getTime()) {
      nextAlarmTime.setDate(nextAlarmTime.getDate() + 7);
    }

    browser.alarms.create(ALARM_NAME, {
      when: nextAlarmTime.getTime(),
      periodInMinutes: 7 * 24 * 60
    });

    console.log(`提醒已更新，將在 ${nextAlarmTime.toLocaleString()} 觸發`);
  });
}

browser.runtime.onInstalled.addListener(() => {
  console.emoji('🦄', '擴充功能已安裝/更新');
  // console.log('擴充功能已安裝/更新，正在設定提醒...');
  // createOrUpdateAlarm();
});

browser.runtime.onStartup.addListener(() => {
  console.log('瀏覽器已啟動，正在設定提醒...');
  createOrUpdateAlarm();
});

browser.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
  if (namespace === 'sync' && (changes.reminderDay || changes.reminderTime)) {
    console.log('偵測到設定變更，正在更新提醒...');
    createOrUpdateAlarm();
  }
});

browser.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === ALARM_NAME) {
    browser.notifications.create({
      type: 'basic',
      iconUrl: '/assets/icons/favicon-48.png',
      title: '午餐提醒',
      message: '該買便當囉！記得嗎？',
      priority: 2
    });
    console.log('便當提醒已顯示！');
  }
});

browser.runtime.onMessage.addListener((request: any) => {
  if (request.action === 'testNotification') {
    browser.notifications.create({
      type: 'basic',
      iconUrl: '/assets/icons/favicon-48.png',
      title: '測試提醒',
      message: '這是一則測試通知！',
      priority: 2
    });
  }
});
