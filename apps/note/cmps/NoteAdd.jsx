
const { useState, useRef, useEffect, Fragment } = React
import { noteAddService } from './../services/noteadd.service.js'
const { useNavigate } = ReactRouter

export function NoteAdd({ setNotes, notes }) {
    const colorsToChoose = ['#f1c2ff', '#ffefba', '#caf5ca', '#c3ecff', '#f2f2f2']
    const [noteMode, setNoteMode] = useState({
        isClicked: false,
        isNoteText: false,
        isNoteImage: false,
        isNoteTodos: false,
        isNoteVideo: false,
        isNoteCanvas: false
    })

    const [colorMode, setColorMode] = useState(false)
    const [numOfListItems, setNumOfListItems] = useState(1)
    const [todos, setTodos] = useState([{ txt: '', doneAt: undefined }])
    const [title, setTitle] = useState('')
    const [isStarred, setIsStarred] = useState(false)
    const [txt, setTxt] = useState('')
    const [bgc, setBgc] = useState(undefined)
    const [img, setImg] = useState({url: ''})
    const [video, setVideo] = useState({url: ''})
    const [placeholder, setPlaceholder] = useState('Take a note...')
    const txtRef = useRef()
    const componentRef = useRef()
    const imgRef = useRef()
    const videoRef = useRef()

    useEffect(() => {
        if (noteMode.isNoteText && txtRef.current) txtRef.current.focus()
    }, [noteMode.isNoteText])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) noteAddService.resetStates(setNoteMode,  setColorMode)}
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function renderNoteImageAdd() {
        
        useEffect(() => { if (noteMode.isNoteImage && imgRef.current) imgRef.current.focus() }, [noteMode.isNoteImage])
        const onSetImg = (e) => setImg({ ...img, url: e.target.value })

        return (
            <Fragment>
                {noteMode.isNoteImage && (<Fragment><div className="icons-star">
                    <span className="star" style={isStarred ? { fontFamily: 'fa' } : { fontFamily: 'fa-reg' }} onClick={() => noteAddService.onSetStarred(setIsStarred)}></span></div>
                <textarea value={img.url} placeholder="Enter your image URL" ref={imgRef} onChange={onSetImg} /></Fragment>)}
            </Fragment>
        )
    }

    function renderNoteVideoAdd() {
        
        useEffect(() => { if (noteMode.isNoteVideo && videoRef.current) videoRef.current.focus() }, [noteMode.isNoteVideo])
        const onSetVideo = (e) => setVideo({ ...video, url: e.target.value })

        return (
            <Fragment>
                {noteMode.isNoteVideo && (<Fragment><div className="icons-star">
                    <span className="star" style={isStarred ? { fontFamily: 'fa' } : { fontFamily: 'fa-reg' }} onClick={() => noteAddService.onSetStarred(setIsStarred)}></span></div>
                <textarea value={video.url} placeholder="Enter your video URL (Vimeo only)" ref={videoRef} onChange={onSetVideo} /></Fragment>)}
            </Fragment>
        )
    }

    function onSave(e) {
        e.stopPropagation()
        if (noteMode.isNoteText) {
            if ((!title && !txt && bgc) || (!title && !txt && !bgc)) return
            noteAddService.saveNote(noteMode, setNotes, isStarred, { title, txt }, bgc)
        } else if (noteMode.isNoteTodos) {
            if (todos.length === 1 && todos[0].txt === '') return
            noteAddService.saveNote(noteMode, setNotes, isStarred, { title, todos }, bgc)
        } else if (noteMode.isNoteImage) {
            if (img.url === '') return
            noteAddService.saveNote(noteMode, setNotes, isStarred, { url: img.url, title }, bgc)
        } else {
            if (video.url === '') return
            noteAddService.saveNote(noteMode, setNotes, isStarred, { url: video.url, title }, bgc)
        }
    }

    function renderNoteTextAdd() {
        return (
            <Fragment>
                {noteMode.isNoteText && (
                    <div className="icons-star">
                        <span className="star" style={isStarred ? { fontFamily: 'fa' } : { fontFamily: 'fa-reg' }} onClick={() => noteAddService.onSetStarred(setIsStarred)}></span>
                    </div>
                )}
                {noteMode.isNoteText && (
                    <textarea ref={txtRef} value={txt} placeholder="Add your note..." onClick={noteAddService.onFocusTxt} onChange={(e) => noteAddService.handleTxtField(e, setTxt)} />)}
            </Fragment>
        )
    }

    function renderNoteTodosAdd() {
        const lastTodoRef = useRef()

        function onFocusListItem(e) {
            e.stopPropagation()
            e.target.focus()
        }

        useEffect(() => { if (lastTodoRef.current) lastTodoRef.current.focus() }, [todos.length])

        const onTypeListItem = (e, idx) => {
            e.stopPropagation()
            setTodos((prevTodos) => {
                const updatedTodos = [...prevTodos]
                updatedTodos[idx] = { ...updatedTodos[idx], txt: e.target.value }
                return updatedTodos
            })
        }

        function onAddListItem(e) {
            if (e.key === 'Enter') setTodos((prevTodos) => [...prevTodos, { txt: '', doneAt: null }])
        }

        function onCompletedTodo(e, idx) {
            e.stopPropagation()
            e.target.classList.add('green')
            setTodos(prevTodos => prevTodos.map((todo, todoIdx) => {
                if (idx === todoIdx) return { ...todo, doneAt: Date.now() }
                return todo
            }))
        }

        return (
            <Fragment>
                {noteMode.isNoteTodos && (
                    <div className="icons-star">
                        <span className="star" style={isStarred ? { fontFamily: 'fa' } : { fontFamily: 'fa-reg' }} onClick={() => noteAddService.onSetStarred(setIsStarred)}></span>
                    </div>
                )}
                {noteMode.isNoteTodos &&
                    todos.map((todo, idx) => (
                        <div className="todo-item flex align-center" key={idx}>
                            <span className="completed-todo" onClick={(e) => onCompletedTodo(e, idx)}></span>
                            <textarea className='todo-textarea' ref={idx === todos.length - 1 ? lastTodoRef : null} onClick={onFocusListItem}
                                onChange={(event) => onTypeListItem(event, idx)} onKeyDown={onAddListItem} placeholder="List Item" value={todo.txt} />
                        </div>
                    ))}
            </Fragment>
        )
    }

    return (
        <div ref={componentRef} className="add-note-div flex space-between" style={{ backgroundColor: bgc || 'transparent' }}>
            <div className="title-place">
                <textarea type="text" placeholder={placeholder} className='title-text-area' name="note-edit" value={title}
                    onClick={(ev) => noteAddService.onTitleClick(ev, noteMode, setNoteMode, setPlaceholder)} onChange={(event) => noteAddService.onChangeTitle(event, setTitle)}></textarea>
            </div>
            {!noteMode.isClicked && (
                <div className="icons">
                    <span className="square-check" onClick={(ev) => noteAddService.onAddTodoNote(ev, setNoteMode, setPlaceholder)}></span>
                    {/* <span className="brush" onClick={(ev) => noteAddService.onAddCanvasNote(ev, setNoteMode, setPlaceholder)}></span> */}
                    <span className="image" onClick={(ev) => noteAddService.onAddImageNote(ev, setNoteMode, setPlaceholder)}></span>
                    <span className="video" onClick={(ev) => noteAddService.onAddVideoNote(ev, setNoteMode, setPlaceholder)}></span>
                </div>
            )}
            {noteMode.isClicked && (
                <div className="user-actions icons">
                    <span className="save" onClick={onSave}></span>
                    <span className="color-palette" onClick={(event) => noteAddService.onSetBgcColor(event, setColorMode)}></span>
                    {colorMode && (
                        <div className="colors-to-choose">
                            {colorsToChoose.map((color, idx) => (
                                <div onClick={(event) => noteAddService.onColorDiv(event, setBgc)} key={color} className="color" id={color}
                                    style={{ backgroundColor: color, left: `${noteAddService.calculateLeftPosition(idx, colorsToChoose.length)}em` }}></div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {renderNoteTextAdd()}
            {renderNoteTodosAdd()}
            {renderNoteImageAdd()}
            {renderNoteVideoAdd()}
        </div>
    )
}