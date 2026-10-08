function mainLoop() {
    const timer = document.querySelector('.jw-text-elapsed');
    const time = timer ? timer.textContent : '';
    const timeArray = time.split(':');
    const timeInSeconds = timeArray.length === 3 ? parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseFloat(timeArray[2]) : parseInt(timeArray[0]) * 60 + parseFloat(timeArray[1]);
    if (time && tracklist.length > 0) {
        let currentTrack
        for (let i = 0; i < tracklist.length; i++) {
            const trackTimeArray = tracklist[i].time.split(':');
            const trackTimeInSeconds = trackTimeArray.length === 3 ? parseInt(trackTimeArray[0]) * 3600 + parseInt(trackTimeArray[1]) * 60 + parseFloat(trackTimeArray[2]) : parseInt(trackTimeArray[0]) * 60 + parseFloat(trackTimeArray[1]);
            if (trackTimeInSeconds > timeInSeconds) {
                break;
            }
            currentTrack = tracklist[i];
        }


        if (currentTrack) {
            // add class to highlight the current track
            const currentCLasses = currentTrack.element.classList;
            if (!currentCLasses.contains('highlight')) {
                // remove highlight from any previously highlighted track
                document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
                currentCLasses.add('highlight');
                currentTrack.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

let tracklist = [];
function setupTracklist() {
    const tracklistParent = document.querySelector('.Tracklist_tracklist__3AjwC');
    if (tracklistParent) {
        const tracklistItems = Array.from(tracklistParent.querySelectorAll('.TracklistCard_card__k0aR_'));
        tracklist = tracklistItems.map((item) => {
            const timeElementParent = item.querySelector('.TracklistCard_timestamp__1YA4U');
            const timeElement = timeElementParent ? timeElementParent.childNodes[0] : null;
            return {
                element: item,
                time: timeElement ? timeElement.textContent : ''
            };
        });
        if (tracklist.length === 0) {
            setTimeout(setupTracklist, 1000);
        }
        if (tracklist.map(item => item.time).includes('')) {
            setTimeout(setupTracklist, 1000);
        }
        const timeStampRegex = /^(\d{2}:)?\d{2}:\d{2}(\.\d{2})?$/;
        if (tracklist.map(item => item.time).some(time => !timeStampRegex.test(time))) {
            setTimeout(setupTracklist, 1000);
        }
    } else {
        setTimeout(setupTracklist, 1000);
    }
}
setupTracklist();
function setupTimeObserver() {
    const timer = document.querySelector('.jw-text-elapsed');
    if (timer) {
        const observer = new MutationObserver(() => {
            mainLoop();
        });
        observer.observe(timer, { childList: true });
    } else {
        setTimeout(setupTimeObserver, 1000);
    }
}
setupTimeObserver();