import { NotePreview } from "../cmps/NotePreview.jsx"
import { noteService } from "../services/note.service.js"
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { NoteHeader } from '../cmps/NoteHeader.jsx'

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromParams(searchParams))

    useEffect(() => {
        setSearchParams(filterBy)
        loadNotes()
    }, [filterBy])

    function onSetFilter(fieldsToUpdate) {
        console.log('fieldsToUpdate', fieldsToUpdate)
        setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
    }

    function loadNotes() {
        noteService.query(filterBy)
            .then((notes) => {
                setNotes(notes)
            })
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes((prevNotes) => prevNotes.filter(note => note.id !== noteId))
                showSuccessMsg(`Note removed successfully (${noteId})`)
            })
            .catch((err) => {
                console.log('Had issues removing note', err)
                showErrorMsg(`Could not remove (${noteId})`)
            })
    }

    function onUpdateNote(noteToUpdate) {
        noteService.save(noteToUpdate)
            .then((savedNote) => {
                setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note))
                showSuccessMsg(`note updated successfully (${noteToUpdate.id})`)
            })
            .catch(err => {
                console.log('Had issues with updating note', err)
                showErrorMsg(`Could not update note (${noteToUpdate.id})`)
            })
    }


    // console.log('notes from note index', notes)
    // console.log('selectednote from note index', selectednote)
    const { txt, minSpeed, desc } = filterBy
    if (!notes) return <div>loading...</div>
    return <section className="note-index">
        <NoteHeader />
        <noteFilter
            onSetFilter={onSetFilter}
            filterBy={{ txt, minSpeed }} />

        <noteFilterDesc
            onSetFilter={onSetFilter}
            filterBy={{ desc }} />

        <Link to="/note/edit"><button>Add a note</button></Link>
        {/* <DataTable notes={notes} onRemovenote={onRemovenote} /> */}
        <noteList
            notes={notes}
            onRemoveNote={onRemoveNote}
            onUpdateNote={onUpdateNote}
        />
    </section >
    return <div>note app</div>

}

