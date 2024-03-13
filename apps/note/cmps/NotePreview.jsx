import { DynamicCmp } from './DynamicCmp.jsx'
export function NotePreview({ filterBy, notes, onRemoveNote, onUpdateNote }) {
    return <section className='notes-main'>
        <ul className='notes-container'>
            {notes.map(note => {
                return <li key={note.id} className="column-element">
                    <DynamicCmp filterBy={filterBy} note={note} />
                </li>
            })}
        </ul>
    </section>
}
