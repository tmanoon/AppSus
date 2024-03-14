const { useState } = React
export function NoteAdd({ setNote, notes }) {

    const [isNote, setNoteClick] = useState(false)
    const [content, setContent] = useState('Take a note...')


    function onAddNote(e) {
        e.target.placeholder = 'Title'
        setNoteClick(true)
    }

    function onAddTodoNote(e) {

    }

    function onAddCanvasNote(e) {

    }

    function onAddImageNote(e) {

    }

    const handleInput = (event) => {
        setContent(event.target.textContent);
    }


    return <div className="add-note-div flex justify-center">
        <input type="text" placeholder="Take a note..." name="note-edit" onClick={onAddNote} />
        {isNote && <span className="pin"></span>}
        {!isNote &&<div className="icons"> <span className="square-check" onClick={onAddTodoNote}></span>
        <span className="brush" onClick={onAddCanvasNote}></span>
        <span className="image" onClick={onAddImageNote}></span></div>}
        {isNote && <div className="add-note-txt"><p contentEditable onInput={handleInput}></p>{content}</div>}
    </div>
}

