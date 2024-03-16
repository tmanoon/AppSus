const { useState } = React

export function NoteText({note}) {

    return <article className={`note ${note.type}`}>
        {note.info.title && <h3>{note.info.title}</h3>}
        <p>{note.info.txt}</p>
    </article>
}