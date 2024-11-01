// Function to fetch the SoundCloud track ID  
function getSoundCloudTrackId() {
    // Find the meta tag with the property 'twitter:app:url:iphone'        
    const metaTag = document.head.querySelector("[property='twitter:app:url:iphone']");
    if (metaTag) {
        const content = metaTag.getAttribute('content');
        if (content.includes('soundcloud://sounds:')) {
            const match = content.match(/soundcloud:\/\/sounds:(\d+)/); 
            if (match && match[1]) {
                return match[1];
            }
        }
    } 
    throw new Error('Track ID not found');
}

// Function to copy text to the clipboard  
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Track ID copied to clipboard:', text);
    }).catch((err) => {
        console.error('Failed to copy text to clipboard:', err);
    });
}

try {
    const trackId = getSoundCloudTrackId();
    copyToClipboard(trackId);
    alert(`Track ID: ${trackId} copied to clipboard`);
} catch (error) {
    console.error(error.message);
}

// Handle button click to enable or disable the extension
document.getElementById('toggleButton').addEventListener('click', () => {
    const extensionId = chrome.runtime.id;
    chrome.management.get(extensionId, (extensionInfo) => {
        const newState = !extensionInfo.enabled;
        chrome.management.setEnabled(extensionId, newState, () => {
            document.getElementById('toggleButton').textContent = newState ? 'Disable Extension' : 'Enable Extension';
        });
    });
});

// When the tab bar icon is clicked this code runs. It sets the state of the extension.
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get('state', function(data) {
        if(data.state == 'on') {
            // Save the state of the extension.
            chrome.storage.local.set({state: 'off'});
            console.log('The tab bar button was clicked for on...');
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: toggleExtOn
            });
        } else {
            // Save the state of the extension.
            chrome.storage.local.set({state: 'on'});
            console.log('The tab bar button was clicked for off...');
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: toggleExtOff
            });
        }
    });
});