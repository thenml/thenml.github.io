function setCookie(name, value, daysToExpire = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
}
function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
function setQueryParam(key, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  const newUrl = window.location.pathname + "?" + urlParams.toString();
  window.history.replaceState({}, "", newUrl);
}



// this solution is temporary
// i should use Jekyll plugins instead

function translateElement(data, element) {
  const elements = element.querySelectorAll('[data-hl]');
  elements.forEach(element => {
    const text = data[element.getAttribute('data-hl')];
    console.log(element, text)

    if (text)
      element.textContent = text;

    element.removeAttribute('data-hl');
  });
}
function translateNewElements(data, parentElement) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          translateElement(data, node);
          translateNewElements(data, node);
        }
      });
    });
  });

  observer.observe(parentElement, { childList: true, subtree: true });
}


let hlang = getQueryParam('hl');
if (!hlang)
  hlang = getCookie('hl') ?? (navigator.language || navigator.userLanguage).split('-')[0];
else
  setCookie('hl', hlang);


function translatePage(code) {
  console.log('translating...')
  if (hlang !== 'en')
    fetch(`/assets/lang/${hlang}/${code}.json`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        translateElement(data, document);
      })
      .catch(error => {
        translateElement({}, document);
      });
  else
    translateElement({}, document);
}