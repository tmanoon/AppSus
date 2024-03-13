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
        setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
    }

    function loadNotes() {
        noteService.query(filterBy)
            .then((notes) => {
                setNotes(notes)
            })
    }
    
    console.log(notes)
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
    const { search, type} = filterBy
    if (!notes) return <div>loading...</div>
    return <section className="note-main">
        <NoteHeader onSetFilter={onSetFilter} filterBy={ {search} }/>
        {/* <noteFilter onSetFilter={onSetFilter} filterBy={{ type }} /> */}


        {/* <Link to="/note/edit"><button>Add a note</button></Link> */}
        {/* <DataTable notes={notes} onRemovenote={onRemovenote} /> */}
        <NotePreview filterBy={filterBy} notes={notes} onRemoveNote={onRemoveNote} onUpdateNote={onUpdateNote} />
    </section >

}

