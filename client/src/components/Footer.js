import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className='inline-flex fixed  right-0 md:bottom-0 md:left-0  p-2'>
            <p className='text-md text-stone-400 '>
                <span className='text-xs'>||</span> <Link to='/'>home </Link>{' '}
                <span className='text-xs'> ||</span>{' '}
                <Link to='/about'>about </Link>{' '}
                <span className='text-xs'>||</span>{' '}
            </p>
        </div>
    );
}
