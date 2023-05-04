import React, { useState, useEffect } from 'react';

function Clock({ stanza, intervalDuration, intervalStartTime }) {
    const [secondsRemaining, setSecondsRemaining] = useState(35);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = Date.now();
            const elapsedTime = now - intervalStartTime;
            const remainingTime = intervalDuration - elapsedTime;

            if (remainingTime > 0) {
                setSecondsRemaining(Math.floor(remainingTime / 1000));
            } else {
                setSecondsRemaining(35);
                clearInterval(intervalId);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalDuration, intervalStartTime]);

    return (
        <div>
            <p>
                {' '}
                next stanza:{' '}
                {`${Math.floor(secondsRemaining / 60)}:${(secondsRemaining % 60)
                    .toString()
                    .padStart(2, '0')}`}
            </p>
        </div>
    );
}

export default Clock;
