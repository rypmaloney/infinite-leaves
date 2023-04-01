import { useState } from 'react';

const FocusedStanza = (props) => {
    const { stanza } = props;

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: stanza.text }} />
        </div>
    );
};

export default FocusedStanza;
