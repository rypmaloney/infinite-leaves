import React from 'react';
import { Link } from 'react-router-dom';
import Clock from './Clock';

export default function Footer(props) {
    const { socketSize, stanza, intervalDuration, intervalStartTime } = props;
    return (
        <div className='inline-flex  fixed  right-0 md:bottom-0 md:left-0  px-2 md:py-2  space-x-8 text-md'>
            <p>
                <span className='text-xs'>||</span> <Link to='/'>home </Link>{' '}
                <span className='text-xs'> ||</span>{' '}
                <Link to='/about'>about </Link>{' '}
                <span className='text-xs'>||</span>{' '}
            </p>
            <div className='hidden md:inline-flex text-stone-500 space-x-3 text-sm m-auto'>
                <Clock
                    stanza={stanza}
                    intervalDuration={intervalDuration}
                    intervalStartTime={intervalStartTime}
                />
                <p>current visitors: {socketSize}</p>
                <p className='text-xs align-bottom m-auto'>
                    Hover over image to see caption.
                </p>
            </div>
        </div>
    );
}
