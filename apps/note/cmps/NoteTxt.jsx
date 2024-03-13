const { useState } = React

export function NoteTxt({note}) {
    const [noteStyle, setNoteStyle] = useState({
        backgroundColor: note.style.backgroundColor
    })

    return <article style={noteStyle} className={`note ${note.type} column-element`}>
        {note.info.title && <h3>{note.info.title}</h3>}
        <p>{note.info.txt}</p>
    </article>
}