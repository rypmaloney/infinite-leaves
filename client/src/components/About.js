import React from 'react';
import { Link } from 'react-router-dom';

export default function About(props) {
    const imageUrl = props.imageUrl;
    return (
        <div className='flex flex-col md:flex-row max-w-2xl m-auto items-center justify-center between  absolute inset-0  min-h-screen'>
            <div className='text-right p-4 '>
                <h1 className='text-2xl text-white w-36'>
                    <em></em>Infinite Leaves
                </h1>
            </div>
            <div className='p-4 mr-auto text-left space-y-2 text-stone-300 border-stone-400 md:border-t-0 border-t-2 md:border-l-2'>
                <p>
                    Infinite Leaves is a digital art exhibit that marries the
                    poetry of Walt Whitman's <em>Leaves of Grass</em> with
                    AI-generated images, created using Stable Diffusion.
                </p>
                <p>
                    Over the course of 14 hours, Infinite Leaves displays, in
                    order, every stanza of <em>Leaves of Grass</em> paired with
                    one of over 8,000 images generated based on a GPT-4
                    interpretation.
                </p>
                <p>
                    Infinite Leaves continues whether you watch or not. Tune in
                    at different times of the day to discover new, and sometimes
                    unsettling, creations.
                </p>
                <p className='text-sm text-white '>
                    <Link to='/'>Back to Infinite Leaves</Link>
                </p>
            </div>
        </div>
    );
}
