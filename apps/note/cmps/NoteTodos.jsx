export function NoteTodos({note}) {
    const noteTodos = note.info.todos

    return <article className={`note ${note.type} todo-note`}>
        {note.info.title && <h3>{note.info.title}</h3>}
        <ul>
            {noteTodos.map(todo => {
                return <li className={todo.doneAt ? 'finished' : ''} key={todo.txt}>{`- ${todo.txt}`}</li>
            })}
            </ul>
    </article>
}
