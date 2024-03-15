const { useState, useRef, useEffect, Fragment } = React
import { noteService } from "../services/note.service.js"
const { useNavigate } = ReactRouter

export function NoteAdd({ setNotes, notes }) {
  const colorsToChoose = ['#f1c2ff', '#ffefba', '#caf5ca', '#c3ecff', '#ffffff']
  const [noteMode, setNoteMode] = useState({
    isClicked: false,
    isNoteTxt: false,
    isNoteImg: false,
    isNoteTodos: false,
    isNoteVideo: false,
    isNoteCanvas: false
  })
  const [colorMode, setColorMode] = useState(false)
  const [title, setTitle] = useState('')
  const [txt, setTxt] = useState('')
  const componentRef = useRef()
  const [bgc, setBgc] = useState('')
  const txtRef = useRef()
  const [isStarred, setIsStarred] = useState(false)

  useEffect(() => {
    if (noteMode.isNoteTxt && txtRef.current) txtRef.current.focus()
  }, [noteMode.isNoteTxt])

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
    setNoteMode({
      isClicked: false,
      isNoteTxt: false,
      isNoteImg: false,
      isNoteTodos: false,
      isNoteVideo: false,
      isNoteCanvas: false
    })
    setColorMode(false)
  }

  function onChangeTitle(e) {
    e.stopPropagation()
    setTitle(e.target.value)
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

  function onAddTxtNote(e) {
    e.stopPropagation()
    e.target.placeholder = 'Title'
    setNoteMode(prevNoteMode => ({
      ...prevNoteMode,
      isClicked: true,
      isNoteTxt: true
    }))
  }

  function onFocusTxt(e) {
    e.stopPropagation()
    e.target.focus()
  }

  function onAddTodoNote(e) {
    setNoteMode(prevNoteMode => ({
      ...prevNoteMode,
      isClicked: true,
      isNoteTodos: true
    }))
  }

  function onAddCanvasNote(e) {
    setNoteMode(prevNoteMode => ({
      ...prevNoteMode,
      isClicked: true,
      isNoteCanvas: true
    }))
  }

  function onAddImageNote(e) {
    setNoteMode(prevNoteMode => ({
      ...prevNoteMode,
      isClicked: true,
      isNoteImg: true
    }))
  }

  function onAddVideoNote(e) {
    setNoteMode(prevNoteMode => ({
      ...prevNoteMode,
      isClicked: true,
      isNoteVideo: true
    }))
  }

  function onSave(e) {
    if (e.type === 'keydown' && e.key !== 'Enter') return
    if ((!title && !txt && bgc) || (!title && !txt && !bgc)) return
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
      isStarred,
      createdAt: Date.now(),
      info: isTitle && isTxt ? { title, txt } : isTitle ? { title } : { txt }
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
        console.log('Had issues saving the note', err)
      })
  }

  function saveWithBgc(isTitle, isTxt) {
    let noteToSave = {
      type: 'NoteTxt',
      isStarred,
      info: isTitle && isTxt ? { title, txt } : isTitle ? { title } : { txt },
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

  function handleTxtField(e) {
    e.stopPropagation()
    setTxt(e.target.value)
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

  function renderNoteTextAdd() {
    return (
      <Fragment>
        {noteMode.isNoteTxt && (
          <div className="icons-star">
            <span
              className="star"
              style={isStarred ? { fontFamily: 'fa' } : { fontFamily: 'fa-reg' }}
              onClick={onSetStarred}></span>
          </div>
        )}
        {noteMode.isNoteTxt && (
          <textarea
            ref={txtRef}
            value={txt}
            placeholder="Add your note..."
            onClick={onFocusTxt}
            onChange={handleTxtField}
            onKeyDown={onSave}
          />
        )}
      </Fragment>
    )
  }

  function renderNoteTodosAdd() {
    return (
      <Fragment>
        {noteMode.isNoteTodos && (
          <div>
            {/* Render the TodoList component here */}
            <TodoList setNotes={setNotes} notes={notes} />
          </div>
        )}
      </Fragment>
    )
  }

  // Render functions for other note types can be added here

  return (
    <div
      ref={componentRef}
      className="add-note-div flex space-between align-center"
      style={{ backgroundColor: bgc || 'transparent' }}>
      <div className="input-place">
        <input
          type="text"
          placeholder="Take a note..."
          name="note-edit"
          value={title}
          onKeyDown={onSave}
          onClick={onAddTxtNote}
          onChange={onChangeTitle}/>
      </div>
      {!noteMode.isClicked && (
        <div className="icons">
          <span className="square-check" onClick={onAddTodoNote}></span>
          <span className="brush" onClick={onAddCanvasNote}></span>
          <span className="image" onClick={onAddImageNote}></span>
          <span className="video" onClick={onAddVideoNote}></span>
        </div>
      )}
      {noteMode.isClicked && (
        <div className="user-actions icons">
          <span className="save" onClick={onSave}></span>
          <span className="color-palette" onClick={onSetBgcColor}></span>
          {colorMode && (
            <div className="colors-to-choose">
              {colorsToChoose.map((color, idx) => (
                <div
                  onClick={onColorDiv}
                  key={color}
                  className="color"
                  id={color}
                  style={{
                    backgroundColor: color,
                    left: `${calculateLeftPosition(idx, colorsToChoose.length)}em`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}
      {renderNoteTextAdd()}
      {renderNoteTodosAdd()}
    </div>
  )
}