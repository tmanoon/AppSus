const { useState } = React

export function NoteVideo({ note }) {
    function convertToEmbedUrl(vimeoUrl) {
        // This pattern matches both simple Vimeo URLs and more complex ones
        const videoIdMatch = vimeoUrl.match(/vimeo\.com\/(\d+)/);
        
        if (videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1];
            // Construct the embed URL for Vimeo
            return `https://player.vimeo.com/video/${videoId}`;
        } else {
            console.error('Invalid Vimeo URL:', vimeoUrl);
            return ''
        }
    }
    

    return (
        <article className={`note ${note.type}`}>
            {note.title && <h3>{note.title}</h3>}
            <iframe 
                className="video-container" 
                src={convertToEmbedUrl(note.info.url)} 
                title="Vimeo video player" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </article>
    );
}