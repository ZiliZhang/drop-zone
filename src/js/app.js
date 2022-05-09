/**
 * Format duration to have leading 0 when is smaller than 10
 * @param {number} d
 * @returns {string}
 */
const formatDuration = (d) => {
    return (d < 10 ? '0' + d : d).toString();
};

/**
 * Update timer HTML
 * @param {number} duration
 * @param {jQuery|Object} $timer
 */
const updateTimer = (duration, $timer) => {
    if (!$timer.length) {
        return;
    }

    let formattedDuration = formatDuration(duration);
    let updatedHtml = '';

    // add sr-only span to read the whole formatted duration
    updatedHtml += `<span class="sr-only">${formattedDuration}</span>`;

    // display the duration in separate characters in the UI
    for (let c of formattedDuration) {
        updatedHtml += `<span class="dz-countdown__value-item" aria-hidden="true">${c}</span>`;
    }

    $timer.html(updatedHtml);
};

/**
 * Update count down timers with respect to duration
 * @param {Object} duration
 * @param {Object} countdownTimers
 */
const updateCountdown = (duration, countdownTimers) => {
    if (typeof countdownTimers !== 'undefined') {
        updateTimer(Number.parseInt(duration.asDays()), countdownTimers.$days);
        updateTimer(duration.hours(), countdownTimers.$hours);
        updateTimer(duration.minutes(), countdownTimers.$minutes);
        updateTimer(duration.seconds(), countdownTimers.$seconds);
    }
};

const $countdown = $('#js-countdown');
if ($countdown && $countdown.length > 0) {
    // set eventTime to midnight to a configurable date
    const eventTime = moment(new Date('05/23/2022').setHours(0, 0, 0, 0)).utc();
    const currentTime = moment().utc();
    const diffTime = eventTime.diff(currentTime);

    if (diffTime > -1) {
        // Display the countdown if event is still active
        const interval = 1000;

        let duration = moment.duration(eventTime.diff(currentTime));
        $countdown.timers = {
            $days: $countdown.find('#js-countdown__days'),
            $hours: $countdown.find('#js-countdown__hours'),
            $minutes: $countdown.find('#js-countdown__minutes'),
            $seconds: $countdown.find('#js-countdown__seconds')
        };

        // load count down initial data on page load
        updateCountdown(duration, $countdown.timers);
        $countdown.addClass('active');

        // count down by seconds
        setInterval(() => {
            duration = moment.duration(duration - interval, 'milliseconds');
            updateCountdown(duration, $countdown.timers);
        }, interval);
    }
}
