export function NoteImage({note}) {

    return <article className={`note ${note.type}`}>
        {note.info.title && <h3>{note.info.title}</h3>}
        <img src={note.info.url} alt={note.info.title}/>
    </article>
}