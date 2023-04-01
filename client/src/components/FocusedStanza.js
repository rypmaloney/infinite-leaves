import { useState } from 'react';
import '../App.css';

const FocusedStanza = (props) => {
    const { stanza } = props;

    return (
        <div>
            {stanza.order == 1 ? (
                <h1 className='text-3xl pb-4 animate-none'>
                    <em>{stanza.poem}</em>
                </h1>
            ) : (
                ''
            )}
            <div
                className='animate'
                dangerouslySetInnerHTML={{ __html: stanza.text }}
            />
        </div>
    );
};

export default FocusedStanza;
