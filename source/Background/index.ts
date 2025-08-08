import browser from 'webextension-polyfill';
import 'emoji-log';

export const ALARM_NAME = 'buyLunchReminder';

async function createOrUpdateAlarm() {
  try {
    const settings = await browser.storage.sync.get({
      reminderDay: '3',
      reminderTime: '12:00'
    });

    // Safely cast properties from the retrieved settings object
    const reminderDay = settings.reminderDay as string;
    const reminderTime = settings.reminderTime as string;

    const [hour, minute] = reminderTime.split(':').map(Number);
    const targetDay = Number(reminderDay);

    const now = new Date();
    const nextAlarmTime = new Date();

    const currentDay = now.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;

    nextAlarmTime.setDate(now.getDate() + daysUntilTarget);
    nextAlarmTime.setHours(hour, minute, 0, 0);

    if (daysUntilTarget === 0 && nextAlarmTime.getTime() < now.getTime()) {
      nextAlarmTime.setDate(nextAlarmTime.getDate() + 7);
    }

    browser.alarms.create(ALARM_NAME, {
      when: nextAlarmTime.getTime(),
      periodInMinutes: 7 * 24 * 60
    });

    console.log(`Reminder updated. Next trigger: ${nextAlarmTime.toLocaleString()}`);
  } catch (error) {
    console.error("Error creating or updating alarm:", error);
  }
}

browser.runtime.onInstalled.addListener(() => {
  console.emoji('🦄', 'Extension installed/updated. Setting initial reminder.');
  createOrUpdateAlarm();
});

browser.runtime.onStartup.addListener(() => {
  console.log('Browser started. Ensuring reminder is set.');
  createOrUpdateAlarm();
});

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && (changes.reminderDay || changes.reminderTime)) {
    console.log('Settings changed. Updating reminder.');
    createOrUpdateAlarm();
  }
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('Alarm triggered! Showing notification.');
    const iconUrl = browser.runtime.getURL('assets/icons/favicon-48.png');
    browser.notifications.create({
      type: 'basic',
      iconUrl,
      title: 'Lunch Reminder',
      message: 'Time to get your lunch!',
      priority: 2
    });
  }
});

// The request object is of type any, as per the webextension-polyfill standards
browser.runtime.onMessage.addListener((request: any) => {
  if (request && request.action === 'testNotification') {
    console.log('Test notification request received.');
    const iconUrl = browser.runtime.getURL('assets/icons/favicon-48.png');
    browser.notifications.create({
      type: 'basic',
      iconUrl,
      title: 'Test Reminder',
      message: 'This is a test notification!',
      priority: 2
    });
  }
});
