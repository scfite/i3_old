const STANDALONE_SETTINGS_STORAGE_KEY = 'options.standalone';
const IS_SAFARI = (() => {
    try {
        return safari && safari.self && safari.self.tab;
    }
    catch (e) {
        return false;
    }
})();

function init() {
    translateTexts()
    
    const parsedUrl = new URL(window.location.href);
    const verificationCodeFromUrl = parsedUrl.searchParams.get('code');
    const error = parsedUrl.searchParams.get('error');
    const success = parsedUrl.searchParams.get('success');

    if (error) {
        displayText('error_' + error);
        hideCode();
        hideForm();
        return;
    }

    if (success) {
        displayText('done_completed');
        hideCode();
        hideForm();
        return;
    }

    getCodeFromBackground().then(verificationCode => {
        if (!verificationCode) {
            throw new Error('No verification code');
        }

        if (verificationCodeFromUrl) {
            confirmAutomaticPairing(verificationCodeFromUrl);
            return;
        }

        displayCode(verificationCode);
    });
    document.getElementById('confirmation_form')
        .addEventListener('submit', (e) => {
            e.preventDefault()
            confirmPairing()
        });

    document.getElementById('confirmation_form_cancel')
        .addEventListener('click', (e) => {
            e.preventDefault()
            displayText('done_cancelled');
            hideCode();
            hideForm();
        });
}

// Safari does not implement the `chrome.runtime.getBackgroundPage` API.
// So for safari we instead rely on regular message passing, and as to minimize
// implementation difference, we just fake chrome's runtime API.
if (IS_SAFARI) {
    const handlers = {};
    var chrome = { runtime: {} };

    safari.self.addEventListener('message', messageEvent => {

        if (messageEvent.name === 'dashlanePairingEvent') {
            handlers[messageEvent.message.requestType](messageEvent.message.code);
        }

    }, false);

    chrome.runtime.getBackgroundPage = function(cb) {
        const backgroundPage = {

            messageController: {

                getVerificationCode: () => {
                    return new Promise(resolve => {
                        safari.self.tab.dispatchMessage('dashlanePairingEvent', {
                            requestType: 'pairingCodeRequest',
                        });

                        handlers['pairingCodeReply'] = code => resolve(code);
                    });
                },

                confirmVerificationCode: () => {
                    safari.self.tab.dispatchMessage('dashlanePairingEvent', {
                        requestType: 'confirmVerificationCode',
                    });
                },

                confirmAutomaticPairing: code => {
                    safari.self.tab.dispatchMessage('dashlanePairingEvent', {
                        requestType: 'confirmAutomaticPairing',
                        code,
                    });
                },

            },

            backgroundController: {

                removeTabWithInternalUrl: url => {
                    safari.self.tab.dispatchMessage('dashlanePairingEvent', {
                        requestType: 'removeTabWithInternalUrl',
                        url,
                    });
                },

            },

        };
        return cb(backgroundPage);
    }

}

function getCodeFromBackground() {
    return new Promise((resolve, reject) => {
        chrome.runtime.getBackgroundPage(backgroundPage => {
            if (!backgroundPage || !backgroundPage.messageController) {
                return reject();
            }

            backgroundPage.messageController
                .getVerificationCode()
                .then(confirmationCode => resolve(confirmationCode));
        })
    });
}

function displayCode(code) {
    if (code.length !== 6) {
        return
    }

    for ( var i = 0; i < code.length; i++ )
    {
        document.getElementById('code_' + i).innerHTML = code.charAt(i);
    }
    
}

function confirmPairing() {
    chrome.runtime.getBackgroundPage(backgroundPage => {
        backgroundPage.messageController.confirmVerificationCode();
        displayWaitingConfirmationMessage();
    })
}

function confirmAutomaticPairing(code) {
    chrome.runtime.getBackgroundPage(backgroundPage => {
        backgroundPage.messageController.confirmAutomaticPairing(code);
        closeWindow();
    })
}

function displayWaitingConfirmationMessage() {
    displayText('wait_text');
    hideForm();
}

function closeWindow() {
    chrome.runtime.getBackgroundPage(backgroundPage => {
        backgroundPage.backgroundController.removeTabWithInternalUrl('pairingVerification.html');
    })
}

function displayText(textId) {
    [].slice.call(document.getElementsByClassName('text')).forEach(element => {
        element.style.display = 'none';
    })
    document.getElementById(textId).style.display = 'block';
}

function hideCode() {
    document.getElementById('code').style.display = 'none';
}

function hideForm() {
    document.getElementById('confirmation_form').style.display = 'none';
}

function translateTexts() {
    const locale = getI18nLocale()

    fetch(`i18n/en.json`)
    .then(r => r.json())
    .then(englishTranslations => {
        if (locale === 'en') {
            return [englishTranslations, englishTranslations]
        }

        return fetch(`i18n/${locale}.json`)
        .then(r => r.json())
        .then(translations => {
            return [englishTranslations, translations]
        })
    })
    .then(([englishTranslations, translations]) => {
        ['click_authorize_text','wait_text','done_completed','done_cancelled',
        'error_NEED_PLUGIN_UPDATE','confirmation_form_authorize','confirmation_form_cancel','help']
        .forEach(elementId => {
            const translation = translations['common/pairingVerification/' + elementId] || englishTranslations['common/pairingVerification/' + elementId]
            const translationWithLink = translation.replace(/_([^_]+)_/, '<a href="https://support.dashlane.com/hc/articles/360000695425" target="_blank">$1</a>')
            document.getElementById(elementId).innerHTML = translationWithLink
        })
    })

}

function getI18nLocale() {
    const availableLocales = ['de','en','es','fr','it','ja','ko','nl','pt','sv','zh']
    const locale = getLanguage().substr(0,2)

    if (availableLocales.indexOf(locale) === -1) {
        return 'en'
    }

    return locale
}

function getLanguage() {
    if (navigator.languages) {
        return navigator.languages[0]
    }

    if (navigator.language) {
        return navigator.language
    }

    return 'en'
}

init();
