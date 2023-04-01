import React, { useState, useEffect } from 'react';
import { S3Image } from 'react-s3';
import '../App.css';

const PoemMeta = (props) => {
    const { stanza, imageUrl } = props;
    const [caption, setCaption] = useState('');
    const [book, setBook] = useState('');
    const [poem, setPoem] = useState('');

    useEffect(() => {
        if (stanza) {
            setCaption(stanza.caption);
            setPoem(stanza.poem);
            setBook(stanza.book);
        }
    }, [stanza]);

    return (
        <div className='flex flex-col md:w-1/2'>
            <div className='md:fixed md:top-0 md:left-0 md:p-16'>
                <h2 className='text-stone-400'>
                    <em>{book}</em>
                </h2>
                <h3 className='text-xl'>
                    <strong>{poem} </strong>
                    <span className='text-xs'> ({stanza.order})</span>
                </h3>
            </div>
            <div className='m-auto'>
                <img
                    className='p-4 h-full w-full md:p-auto md:h-96 md:w-96 animate'
                    src={imageUrl}
                    title={caption}
                ></img>
            </div>
        </div>
    );
};

export default PoemMeta;
