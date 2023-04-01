import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';

import PoemMeta from './components/PoemMeta';
import StanzaCol from './components/StanzaCol';

export default function App(props) {
    const { currentStanza, prevStanzas, nextStanzas, imageUrl } = props;
    return (
        <div>
            <div className='flex flex-col items-center  md:flex-row lg:px-32 text-left absolute inset-0  min-h-screen '>
                <PoemMeta stanza={currentStanza} imageUrl={imageUrl} />
                <StanzaCol
                    stanza={currentStanza}
                    prevStanzas={prevStanzas}
                    nextStanzas={nextStanzas}
                />
            </div>
        </div>
    );
}
