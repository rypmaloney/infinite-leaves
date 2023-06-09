import React, { useState, useEffect } from 'react';
import UnfocusedStanzas from './UnfocusedStanzas';
import FocusedStanza from './FocusedStanza';
import Lorem from './Lorem';
import '../App.css';

const StanzaCol = (props) => {
    const { stanza, prevStanzas, nextStanzas } = props;
    const [textSize, setTextSize] = useState('');

    const getSize = () => {
        if (stanza.text && stanza.text.length > 1000)
            return 'md:text-lg overflow-y-scroll';
        if (stanza.text && stanza.text.length > 250) return 'md:text-xl';
        return 'md:text-2xl';
    };

    useEffect(() => {
        setTextSize(getSize());
    }, [stanza]);

    return (
        <div className='flex-col flex start md:justify-center mx-auto md:min-h-screen relative  md:overflow-hidden md:max-h-screen md:w-1/2 md:pr-16 md:m-auto px-8 space-y-12 '>
            <div className=' hidden md:block relative'>
                <div className='absolute bottom-0 space-y-8 text-xl md:pl-8'>
                    <Lorem />
                    <UnfocusedStanzas stanzas={prevStanzas} />
                </div>
            </div>
            <div className={`${textSize} pb-48 md:p-0 md:ml-0 max-h-screen `}>
                <FocusedStanza stanza={stanza} />
            </div>
            <div className='relative hidden md:block md:pl-8 '>
                <div className='absolute top-0 space-y-8 text-xl'>
                    <UnfocusedStanzas stanzas={nextStanzas} />
                    <Lorem />
                </div>
            </div>
        </div>
    );
};

export default StanzaCol;
