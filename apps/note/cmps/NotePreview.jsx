import { DynamicCmp } from './DynamicCmp.jsx'
export function NotePreview({ filterBy, notes, onRemoveNote, onUpdateNote }) {
    return <section className='notes-main'>
        <ul className='notes-container'>
            {notes.map(note => {
                return <li key={note.id} style={{backgroundColor: note.style.backgroundColor}} className='note-element'>
                    <div className='remove-btn-container'><button className='btn remove-btn' onClick={() => onRemoveNote(note.id)}></button></div>
                    <DynamicCmp filterBy={filterBy} note={note} />
                </li>
            })}
        </ul>
    </section>
}
