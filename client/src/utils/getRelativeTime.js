const getRelativeTime = (timestamp) => {
    const millisToSeconds = 1000;
    const millisToMinutes = millisToSeconds * 60;
    const millisToHours = millisToMinutes * 60;
    const millisToDays = millisToHours * 24;
    const millisToMonth = millisToDays * 30;

    const timeElapsed = Date.now() - timestamp;

    if (timeElapsed < millisToSeconds * 59) return 'just now';
    if (timeElapsed >= millisToMinutes && timeElapsed < millisToHours) {
        const elapsedToMinutes = Math.round( timeElapsed / millisToMinutes);
        return `${elapsedToMinutes} minutes ago`;
    }
    if (timeElapsed >= millisToHours && timeElapsed < millisToDays) {
        const elapsedToHours = Math.round( timeElapsed / millisToHours);
        return `${elapsedToHours} hours ago`;
    }
    if (timeElapsed >= millisToHours && timeElapsed < millisToDays) {
        const elapsedToHours = Math.round( timeElapsed / millisToHours);
        return `${elapsedToHours} hours ago`;
    }
    if (timeElapsed >= millisToDays && timeElapsed < millisToMonth) {
        const elapsedToDays = Math.round( timeElapsed / millisToDays);
        return `${elapsedToDays} days ago`;
    }
    return 'eons ago';
};

export default getRelativeTime;
