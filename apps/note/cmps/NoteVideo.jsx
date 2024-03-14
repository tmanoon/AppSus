const { useState } = React
const YOUTUBE_KEY = 'AIzaSyCTQz71hx7kDku_rTxCIv2sRFy7EbTddjM'

export function NoteVideo({ note }) {
    function convertToEmbedUrl(youtubeUrl) {
        // Extract the video ID from the URL
        const videoIdMatch = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/[^/]+\/|(?:[^/?]+\/)?(?:embed\/|watch\?.*?v=)))([^&#/?]+).*$/);
        
        if (videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1];
            // Construct the embed URL
            return `https://www.youtube.com/embed/${videoId}?si=zui9NT5ZMDtJQZCG`;
        } else {
            console.error('Invalid YouTube URL');
            return ''; // Return an empty string or a suitable placeholder
        }
    }

    return <article className={`note ${note.type}`}>
        {note.title && <h3>{note.title}</h3>}
        <iframe className="column-element" width="200" height="315" src={convertToEmbedUrl(note.info.url)} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    </article>
}

// https://www.googleapis.com/youtube/v3/search?part=snippet &videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}