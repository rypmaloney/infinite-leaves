import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Footer from './components/Footer';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { socket } from './socket';

const InfinteLeaves = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [prevStanzas, setPrevStanzas] = useState([]);
    const [currentStanza, setCurrentStanza] = useState({});
    const [nextStanzas, setNextStanzas] = useState([]);

    const getUrl = (key) => {
        const prompt = '01';
        const image_order = '00';

        return `https://infinite-leaves.s3.amazonaws.com/${prompt}/${key}-${prompt}-${image_order}.png`;
    };

    const setPage = (data) => {
        setCurrentStanza(data['+0']);
        setPrevStanzas(filterKeys(data, '-'));
        setNextStanzas(filterKeys(data, '+'));

        const url = getUrl(data['+0'].key);
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
        <Router>
            <div
                className='App animate min-h-screen  bg-center bg-cover text-stone-300'
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className='relative min-h-screen  bg-zinc-900 bg-opacity-90 backdrop-blur-md'>
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
                        <Route
                            path='/about'
                            element={<About imageUrl={imageUrl} />}
                        />
                    </Routes>
                    <Footer />
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