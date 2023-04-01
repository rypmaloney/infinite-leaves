import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';

import PoemMeta from './components/PoemMeta';
import StanzaCol from './components/StanzaCol';

export default function App() {
    const [prevStanzas, setPrevStanzas] = useState([]);
    const [currentStanza, setCurrentStanza] = useState({});
    const [nextStanzas, setNextStanzas] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const setPage = (data) => {
        setCurrentStanza(data['+0']);
        setPrevStanzas(filterKeys(data, '-'));
        setNextStanzas(filterKeys(data, '+'));
        const url = `/images/${data['+0'].key}-01-00.png`;
        setImageUrl(url);
    };
    const setStartingState = async () => {
        try {
            const dataUrl = '/data/log.json';
            const response = await fetch(dataUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            const data = await response.json();
            setPage(data);
        } catch (error) {
            console.error(error);
        }
    };
    function filterKeys(obj, filter) {
        let filteredArr = [];
        for (const [key, value] of Object.entries(obj)) {
            if (filter === '+' && Number(key) > 0) {
                filteredArr.push(value);
            } else if (filter === '-' && Number(key) < 0) {
                filteredArr.push(value);
            }
        }
        return filteredArr;
    }
    socket.on('updateStanzas', (data) => {
        setPage(data);
    });

    useEffect(() => {
        setStartingState();
    }, []);

    return (
        <div
            className='App max-h-screen min-h-screen bg-cover bg-center h-screen text-stone-300'
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <div className='relative min-h-screen h-screen bg-zinc-900 bg-opacity-90 backdrop-blur-md'></div>
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
