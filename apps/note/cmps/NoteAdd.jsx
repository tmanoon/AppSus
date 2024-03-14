const { useState, useRef, useEffect } = React
import { noteService } from "../services/note.service.js"
const { useNavigate } = ReactRouter

export function NoteAdd({ setNotes, notes }) {
    const colorsToChoose = ['#f1c2ff', '#ffefba', '#caf5ca', '#c3ecff', '#ffffff']
    const [isNote, setNoteClick] = useState(false)
    const [colorMode, setColorMode] = useState(false)
    const [title, setTitle] = useState('')
    const [txt, setTxt] = useState('')
    // const navigate = useNavigate()
    // const titleRef = useRef()
    const [bgc, setBgc] = useState('')
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

    function onColorDiv(e) {
        e.stopPropagation()
        setBgc(e.target.id)
    }

    function onSetBgcColor(e) {
        e.stopPropagation()
        setColorMode(prevColorMode => !prevColorMode)
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
                    setNotes(notes => [...notes, savedNote])
                })
                .catch(err => {
                    console.log('Had issues saving the note', err)
                })
        } else if (title && !txt) {
            noteService.save({ type: 'NoteTxt', isStarred: isStarred, info: { title: title } })
                .then(savedNote => {
                    setNotes(notes => [...notes, savedNote])
                })
                .catch(err => {
                    console.log('Had issues saving the note', err)
                })
        } else {
            noteService.save({ type: 'NoteTxt', isStarred: isStarred, info: { txt: txt } })
                .then(savedNote => {
                    setNotes(notes => [...notes, savedNote])
                })
                .catch(err => {
                    console.log('Had issues saving the note', err)
                })
        }
    }

    function handleTxtField(e) {
        e.stopPropagation()
        const val = e.target.value
        setTxt(val)
    }

    function calculateLeftPosition(idx, numberOfDivs) {
        const containerWidthEm = 7.625
        const divWidthEm = 1.25
        // const spacingEm = 0.3125

        const totalDivWidth = numberOfDivs * divWidthEm
        const availableSpace = containerWidthEm - totalDivWidth
        const spaceBetweenDivs = availableSpace / (numberOfDivs + 1)
        const leftPosition = (idx + 1) * spaceBetweenDivs + (idx * divWidthEm)
        return leftPosition
    }

    return <div className={"add-note-div flex space-between align-center"} style={{ backgroundColor: bgc || 'transparent' }}>
        <div className="input-place">
            <input type="text" placeholder="Take a note..." name="note-edit" value={title} onKeyDown={onSaveByEnter} onClick={onAddNote} onChange={onChangeTitle} /></div>
        {isNote && <div className="icons-star"><span className="star" onClick={onSetStarred}></span></div>}
        {!isNote && <div className="icons"><span className="square-check" onClick={onAddTodoNote}></span>
            <span className="brush" onClick={onAddCanvasNote}></span>
            <span className="image" onClick={onAddImageNote}></span></div>}
        {isNote && <textarea ref={txtRef} value={txt} placeholder="Add your note..." onClick={onFocusTxt} onChange={handleTxtField} onKeyDown={onSaveByEnter} />}
        {isNote && <div className="user-actions icons">
            <span className="save"></span><span className="color-palette" onClick={onSetBgcColor}></span>
            {colorMode && <div className="colors-to-choose">
                {colorsToChoose.map((color, idx) => (
                    <div onClick={onColorDiv}
                        key={color}
                        className="color"
                        id={color}
                        style={{ backgroundColor: color, left: `${calculateLeftPosition(idx, colorsToChoose.length)}em`}}></div>
                ))}
            </div>}
        </div>}
    </div>
}
