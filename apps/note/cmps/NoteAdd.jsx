const { useState, useRef, useEffect } = React
import { noteService } from "../services/note.service.js"
const { useNavigate } = ReactRouter

export function NoteAdd({ setNotes, notes }) {

    const [isNote, setNoteClick] = useState(false)
    // const [content, setContent] = useState('Take a note...')
    const [title, setTitle] = useState('')
    const [txt, setTxt] = useState('')
    const navigate = useNavigate()
    // const titleRef = useRef()
    const txtRef = useRef()
    const [isStarred, setIsStarred] = useState(false)

    useEffect(() => {
        if (isNote && txtRef.current) txtRef.current.focus()
        // else txtRef.current.blur()
    }, [isNote])

    function onChangeTitle(e) {
        e.stopPropagation()
        const val = e.target.value
        setTitle(val)
    }

    function onSetStarred() {
        setIsStarred(prevIsStarred => !prevIsStarred)
    }

    function onAddNote(e) {
        e.stopPropagation()
        e.target.placeholder = 'Title'
        setNoteClick(true)
    }

    function onFocusTxt(e) {
        e.stopPropagation()
        e.target.focus()
    }

    function onAddTodoNote(e) {

    }

    function onAddCanvasNote(e) {

    }

    function onAddImageNote(e) {

    }

    function onSaveByEnter(e) {
        if (e.key !== 'Enter') return
        if (title) {
            noteService.save({ type: 'NoteTxt', isStarred: isStarred, info: { title: title, txt: txt } })
                .then(savedNote => {
                    setNotes(prevNotes => [...prevNotes, savedNote])
                })
                .catch(err => {
                    console.log('Had issues saving car', err)
                })
        } else if(title && !txt) {
            noteService.save({ type: 'NoteTxt', isStarred: isStarred, info: { title: title } })
            .then(savedNote => {
                setNotes(prevNotes => [...prevNotes, savedNote])
            })
            .catch(err => {
                console.log('Had issues saving car', err)
            })
        } else {
            noteService.save({ type: 'NoteTxt', isStarred: isStarred, info: { txt: txt } })
            .then(savedNote => {
                setNotes(prevNotes => [...prevNotes, savedNote])
            })
            .catch(err => {
                console.log('Had issues saving car', err)
            })
        }
    }

    function handleTxtField(e) {
        e.stopPropagation()
        const val = e.target.value
        setTxt(val)
    }


    return <div className={"add-note-div flex space-between align-center"}>
        <div className="input-place">
            <input type="text" placeholder="Take a note..." name="note-edit" value={title} onKeyDown={onSaveByEnter} onClick={onAddNote} onChange={onChangeTitle} /></div>
        {isNote && <div className="icons-star"><span className="star" onClick={onSetStarred}></span></div>}
        {!isNote && <div className="icons"><span className="square-check" onClick={onAddTodoNote}></span>
            <span className="brush" onClick={onAddCanvasNote}></span>
            <span className="image" onClick={onAddImageNote}></span></div>}
        {isNote && <textarea ref={txtRef} value={txt} placeholder="Add your note..." onClick={onFocusTxt} onChange={handleTxtField} onKeyDown={onSaveByEnter} />}
    </div>
}

