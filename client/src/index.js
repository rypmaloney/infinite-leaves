import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Footer from './components/Footer';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { socket } from './socket';

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

window.addEventListener('resize', appHeight);

const InfinteLeaves = () => {
    const [imageUrl, setImageUrl] = useState('images/fallback.png');
    const [nextImageUrls, setNextImageUrls] = useState('');
    const [prevStanzas, setPrevStanzas] = useState([]);
    const [currentStanza, setCurrentStanza] = useState({});
    const [nextStanzas, setNextStanzas] = useState([]);
    const [socketSize, setSocketSize] = useState(1);

    const [intervalDuration, setIntervalDuration] = useState(0);
    const [intervalStartTime, setIntervalStartTime] = useState(0);

    const setPage = (data) => {
        setImageUrl(data['+0'].url);
        setCurrentStanza(data['+0']);
        setPrevStanzas(filterKeys(data, '-'));
        setNextStanzas(filterKeys(data, '+'));

        setIntervalStartTime(JSON.parse(data['start']));
        setIntervalDuration(JSON.parse(data['interval']));
        setSocketSize(JSON.parse(data['size']));
        setNextImageUrls(data['+1'].url);

        appHeight();
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

    useEffect(() => {
        for (const url of nextImageUrls) {
            let img = new Image();
            img.src = url;
        }
    }, [imageUrl]);

    return (
        <Router>
            <div
                className='App animate min-h-screen  bg-center bg-cover text-stone-300'
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className='relative min-h-screen App bg-zinc-800 bg-opacity-80 backdrop-blur-md'>
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <App
                                    imageUrl={imageUrl}
                                    setImageUrl={setImageUrl}
                                    currentStanza={currentStanza}
                                    prevStanzas={prevStanzas}
                                    nextStanzas={nextStanzas}
                                />
                            }
                        />
                        <Route path='/about' element={<About />} />
                    </Routes>
                    <Footer
                        socketSize={socketSize}
                        stanza={currentStanza}
                        intervalDuration={intervalDuration}
                        intervalStartTime={intervalStartTime}
                    />
                </div>
            </div>
        </Router>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <InfinteLeaves />
    </React.StrictMode>
);
