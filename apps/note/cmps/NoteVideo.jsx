export function NoteVideo({ note }) {
    function convertToEmbedUrl(vimeoUrl) {
        const videoIdMatch = vimeoUrl.match(/vimeo\.com\/(\d+)/)
        
        if (videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1]
            return `https://player.vimeo.com/video/${videoId}`
        } else {
            console.error('Invalid Vimeo URL:', vimeoUrl)
            return ''
        }
    }
    

    return (
        <article className={`note ${note.type}`}>
            {note.info.title && <h3>{note.info.title}</h3>}
            <iframe 
                className="video-container" 
                src={convertToEmbedUrl(note.info.url)} 
                title="Vimeo video player" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </article>
    )
}