export function NoteImg({note}) {

    return <article className={`note ${note.type}`}>
        {note.title && <h3>{note.title}</h3>}
        <img src={note.info.url} alt={note.info.title}/>
    </article>
}