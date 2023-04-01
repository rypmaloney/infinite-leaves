import React, { useState, useEffect } from 'react';

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
                    Hover over the image for the prompt that generated it. All
                    images generated with Stable Diffusion.
                </p>
            </div>
        </div>
    );
};

export default PoemMeta;
