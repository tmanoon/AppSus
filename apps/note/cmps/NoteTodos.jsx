const { useState } = React
export function NoteTodos({note}) {
    const noteTodos = note.info.todos
    const [noteStyle, setNoteStyle] = useState({
        backgroundColor: note.style.backgroundColor,
    })

    return <article style={noteStyle} className={`column-element note ${note.type} todo-note`}>
        {note.title && <h3>{note.title}</h3>}
        <ul>
            {noteTodos.map(todo => {
                return <li className={todo.doneAt ? 'finished' : ''} key={todo.txt}>{todo.txt}</li>
            })}
            </ul>
    </article>
}

// numForId++, 'NoteTodos', false, {title: 'Get my stuff together',
//  todos: [{ txt: 'Driving license', doneAt: null }, { txt: 'Coding power', doneAt: 187111111 }]} 

