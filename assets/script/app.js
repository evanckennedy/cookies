'use strict';

// This app requires a server to handle import statements
// and CORS issues
import * as utils from './utils.js';

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Selector                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const dialog1 = utils.select('.dialog-one');
const dialog2 = utils.select('.dialog-two');
const acceptButton = utils.select('.accept');
const settingsButton = utils.select('.settings');
const saveButton = utils.select('.save-preferences');
let checkboxes = utils.selectAll('input[type="checkbox"]');
console.log(checkboxes.length);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Accept all cookies                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function setAllCookies() {
  setCookie('Browser', getOS(), 15);
  setCookie('Operating system', getBrowser(), 15);
  setCookie('Screen width', getScreenWidth(), 15);
  setCookie('Screen height', getScreenHeight(), 15);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Some Cookies                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function personalizeCookies() {
  const name = ['Browser', 'Operating system', 'Screen width', 'Screen height']
  const valuesArr = [getOS(), getBrowser(), getScreenWidth(), getScreenHeight()];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      setCookie(name[i], valuesArr[i], 15)
    }
  } 
}


let inputElement = document.querySelector('input[type="checkbox"]');
if (inputElement.checked) {
  console.log('The checkbox is checked.');
} else {
  console.log('The checkbox is not checked.');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Settings                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function showSettings() {
  dialog1.classList.add('display-none');
  dialog2.classList.remove('display-none');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Cookies                                              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function setCookie(name, value, maxAge) {
  const options = {
    path: '/',
    SameSite: 'Lax'
  }

  const encodedName = encodeURIComponent(name)
  const encodedValue = encodeURIComponent(value)
  let cookieText = `${encodedName}=${encodedValue}; max-age=${maxAge}; path=${options.path}; SameSite=${options.SameSite}`;

  document.cookie = cookieText;
}

function getCookie(name) {
  const encodedName = `${encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&')}=`;
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodedName}(.*?)(\$|; )`));
  return match ? decodeURIComponent(match[1]) : 'Rejected';
}

const userAgent = navigator.userAgent.toLowerCase();

function getOS() {
  const osList = [
    { name: 'Mac OS', keys: ['macintosh', 'mac os x'] },
    { name: 'Windows', keys: ['windows'] },
    { name: 'Linux', keys: ['linux'] }
  ];

  for (let os of osList) {
    if (os.keys.some(key => userAgent.includes(key))) {
      return encodeURIComponent(os.name);
    }
  }

  return encodeURIComponent('Unknown');
}

function getBrowser() {
  const browserList = [
    { name: 'Firefox', keys: ['firefox'] },
    { name: 'Chrome', keys: ['chrome'], exclude: ['edg'] },
    { name: 'Safari', keys: ['safari'], exclude: ['chrome'] },
    { name: 'Edge', keys: ['edg']}
  ];

  for (let browser of browserList) {
    if (browser.keys.some(key => userAgent.includes(key)) &&
        !(browser.exclude && browser.exclude.some(key => userAgent.includes(key)))) {
      return encodeURIComponent(browser.name);
    }
  }

  return encodeURIComponent('Unknown');
}

function getScreenWidth() {
  return encodeURIComponent(`${window.innerWidth}px`);
}

function getScreenHeight() {
  return encodeURIComponent(`${window.innerHeight}px`);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Check Cookies                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function checkCookies() {
  // Check if cookies are enabled
  if (navigator.cookieEnabled) {
    // Check if there are any cookies stored
    if (document.cookie.length === 0) {
      setTimeout(() => {
        dialog1.classList.remove('display-none');
      }, 1000);
    }
  } else {
    setTimeout(() => {
      dialog1.classList.remove('display-none');
    }, 1000);
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Event Listeners                                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('DOMContentLoaded', document, checkCookies);
utils.listen('click', settingsButton, showSettings);
utils.listen('click', acceptButton, () => {
  setAllCookies();
  dialog1.classList.add('display-none');
});
