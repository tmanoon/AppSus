const { useState, useRef, useEffect } = React
import { noteService } from "../services/note.service.js"
const { useNavigate } = ReactRouter

export function NoteAdd({ setNotes, notes }) {
    const colorsToChoose = ['#f1c2ff', '#ffefba', '#caf5ca', '#c3ecff', '#ffffff']
    const [isNote, setNoteClick] = useState(false)
    const [colorMode, setColorMode] = useState(false)
    const [title, setTitle] = useState(undefined)
    const [txt, setTxt] = useState(undefined)
    const componentRef = useRef()
    // const navigate = useNavigate()
    // const titleRef = useRef()
    const [bgc, setBgc] = useState('')
    const txtRef = useRef()
    const [isStarred, setIsStarred] = useState(false)

    useEffect(() => {
        if (isNote && txtRef.current) txtRef.current.focus()
    }, [isNote])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                resetStates()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function resetStates() {
        setNoteClick(false)
        setColorMode(false)
    }

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

    function onSave(e) {
        if (e.type === 'keydown' && e.key !== 'Enter') return
        if ((!title && !txt && bgc) || (!title && !txt && !bgc)) return
        console.log(title, txt, bgc)
        if (title && !txt && bgc) saveWithBgc(true, false)
        else if (title && txt && bgc) saveWithBgc(true, true)
        else if (!title && txt && bgc) saveWithBgc(false, true)
        else if (title && txt) saveNote(true, true)
        else if (title && !txt) saveNote(true, false)
        else if (!title && txt) saveNote(false, true)
    }

    function saveNote(isTitle, isTxt) {
        let noteToSave = {
            type: 'NoteTxt',
            isStarred: isStarred,
            createdAt: Date.now(),
            info: isTitle && isTxt ? { title: title, txt: txt } : isTitle ? { title: title } : { txt: txt }
        };

        noteService.save(noteToSave)
            .then(savedNote => {
                setNotes(prevNotes => {
                    const updatedNotes = [...prevNotes, savedNote]
                    return updatedNotes.sort((firstNote, secondNote) => {
                        if (secondNote.isStarred !== firstNote.isStarred) {
                            return secondNote.isStarred - firstNote.isStarred
                        }
                        return secondNote.createdAt - firstNote.createdAt
                    })
                })
            })
            .catch(err => {
                console.log('Had issues saving the note', err)
            })
    }

    function saveWithBgc(isTitle, isTxt) {
        let noteToSave = {
            type: 'NoteTxt',
            isStarred: isStarred,
            info: isTitle && isTxt ? { title: title, txt: txt } : isTitle ? { title: title } : { txt: txt },
            style: { backgroundColor: bgc }
        }

        noteService.save(noteToSave)
            .then(savedNote => {
                setNotes(prevNotes => {
                    const updatedNotes = [...prevNotes, savedNote]
                    return updatedNotes.sort((firstNote, secondNote) => {
                        if (secondNote.isStarred !== firstNote.isStarred) {
                            return secondNote.isStarred - firstNote.isStarred
                        }
                        return secondNote.createdAt - firstNote.createdAt
                    })
                })
            })
            .catch(err => {
                console.log('Had issues saving the note with background color', err)
            })
    }

    function onAddVideoNote(e) {

    }

    function handleTxtField(e) {
        e.stopPropagation()
        const val = e.target.value
        setTxt(val)
    }

    function calculateLeftPosition(idx, numberOfDivs) {
        const containerWidthEm = 7.625
        const divWidthEm = 1.25

        const totalDivWidth = numberOfDivs * divWidthEm
        const availableSpace = containerWidthEm - totalDivWidth
        const spaceBetweenDivs = availableSpace / (numberOfDivs + 1)
        const leftPosition = (idx + 1) * spaceBetweenDivs + (idx * divWidthEm)
        return leftPosition
    }

    return <div ref={componentRef} className={"add-note-div flex space-between align-center"} style={{ backgroundColor: bgc || 'transparent' }}>
        <div className="input-place">
            <input type="text" placeholder="Take a note..." name="note-edit" value={title} onKeyDown={onSave} onClick={onAddNote} onChange={onChangeTitle} /></div>
        {isNote && <div className="icons-star"><span className="star" style={isStarred && { fontFamily: 'fa' } || { fontFamily: 'fa-reg' }} onClick={onSetStarred}></span></div>}
        {!isNote && <div className="icons"><span className="square-check" onClick={onAddTodoNote}></span>
            <span className="brush" onClick={onAddCanvasNote}></span>
            <span className="image" onClick={onAddImageNote}></span>
            <span className="video" onClick={onAddVideoNote}></span></div>}
        {isNote && <textarea ref={txtRef} value={txt} placeholder="Add your note..." onClick={onFocusTxt} onChange={handleTxtField} onKeyDown={onSave} />}
        {isNote && <div className="user-actions icons">
            <span className="save" onClick={onSave}></span><span className="color-palette" onClick={onSetBgcColor}></span>
            {colorMode && <div className="colors-to-choose">
                {colorsToChoose.map((color, idx) => (
                    <div onClick={onColorDiv}
                        key={color}
                        className="color"
                        id={color}
                        style={{ backgroundColor: color, left: `${calculateLeftPosition(idx, colorsToChoose.length)}em` }}></div>
                ))}
            </div>}
        </div>}
    </div>
}
