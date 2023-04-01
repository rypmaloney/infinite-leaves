import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import UnfocusedStanzas from './components/UnfocusedStanzas';
import FocusedStanza from './components/FocusedStanza';
import Lorem from './components/Lorem';

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [prevStanzas, setPrevStanzas] = useState([]);
    const [currentStanza, setCurrentStanza] = useState({});
    const [nextStanzas, setNextStanzas] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [book, setBook] = useState('');
    const [poem, setPoem] = useState('');
    const [smallText, setTextSmall] = useState(false);

    const setPage = (data) => {
        setCurrentStanza(data['+0']);
        setPrevStanzas(filterKeys(data, '-'));
        setNextStanzas(filterKeys(data, '+'));
        const url = `/images/${data['+0'].key}-01-00.png`;
        setImageUrl(url);
        setCaption(data['+0'].caption);
        setPoem(data['+0'].poem);
        setBook(data['+0'].book);

        setTextSmall(false);
        if (data['+0'].text.length > 250) {
            setTextSmall(true);
        }
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

    useEffect(() => {
        setStartingState();

        function onConnect() {
            console.log('connected');
            setIsConnected(true);
        }
        function onDisconnect() {
            setIsConnected(false);
        }
        socket.on('updateStanzas', (data) => {
            setPage(data);
        });
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div
            className='App max-h-screen min-h-screen bg-cover bg-center h-screen text-stone-300'
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <div className='relative min-h-screen h-screen bg-zinc-900 bg-opacity-90 backdrop-blur-md'></div>
            <div className='flex flex-col items-center  md:flex-row lg:px-32 text-left absolute inset-0  min-h-screen '>
                <div className='flex flex-col md:w-1/2'>
                    <div className='md:fixed md:top-0 md:left-0 md:p-16'>
                        <h2 className='text-stone-400'>
                            <em>{book}</em>
                        </h2>
                        <h3 className='text-xl'>
                            <strong>{poem}</strong>
                        </h3>
                    </div>
                    <div className='m-auto'>
                        <img
                            className='p-4 h-full w-full md:p-auto md:h-96 md:w-96'
                            src={imageUrl}
                            title={caption}
                        ></img>
                    </div>
                    <div className='md:fixed md:bottom-0 md:left-0 p-2'>
                        <p className='hidden md:block text-sm p-2 text-center text-stone-700'>
                            Hover over the image for the prompt that generated
                            it. All images generated with Stable Diffusion.
                        </p>
                    </div>
                </div>
                <div className='flex-col flex justify-center mx-auto md:min-h-screen relative overflow-hidden max-h-screen md:w-1/2 md:pr-16 md:m-auto p-8 space-y-12 '>
                    <div className=' hidden md:block relative'>
                        <div className='absolute bottom-0 space-y-8 text-xl md:pl-8'>
                            <Lorem />
                            <UnfocusedStanzas stanzas={prevStanzas} />
                        </div>
                    </div>
                    <div
                        className={`${
                            smallText ? 'md:text-xl' : 'md:text-2xl'
                        }  md:ml-0`}
                    >
                        <FocusedStanza stanza={currentStanza} />
                    </div>
                    <div className='relative hidden md:block md:pl-8 '>
                        <div className='absolute top-0 space-y-8 text-xl'>
                            <UnfocusedStanzas stanzas={nextStanzas} />
                            <Lorem />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
