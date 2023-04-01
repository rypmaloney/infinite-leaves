import { useState } from 'react';

const UnfocusedStanzas = (props) => {
    const { stanzas } = props;

    return (
        <div className='flex flex-col space-y-5'>
            {stanzas.map((stanza) => {
                return (
                    <div className='w-full text-stone-500'>
                        <div
                            dangerouslySetInnerHTML={{ __html: stanza.text }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default UnfocusedStanzas;
