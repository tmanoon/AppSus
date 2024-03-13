const { useState } = React

export function NoteImg({note}) {
    const [noteStyle, setNoteStyle] = useState({
        backgroundColor: note.style.backgroundColor
    })

    return <article style={noteStyle} className={`note ${note.type}`}>
        {note.title && <h3>{note.title}</h3>}
        <img src={note.info.url} alt={note.info.title}/>
    </article>
}