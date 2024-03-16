
import { noteService } from "./note.service.js"

export const noteAddService = {
    resetStates,
    onChangeTitle,
    onColorDiv,
    onSetBgcColor,
    onSetStarred,
    onTitleClick,
    onFocusTxt,
    onAddTodoNote,
    onAddCanvasNote,
    onAddImageNote,
    onAddVideoNote,
    saveNote,
    handleTxtField,
    calculateLeftPosition
}

function resetStates(setNoteMode, setColorMode) {
    setNoteMode({
        isClicked: false,
        isNoteText: false,
        isNoteImage: false,
        isNoteTodos: false,
        isNoteVideo: false,
        isNoteCanvas: false
    })
    setColorMode(false)
}

function onChangeTitle(e, setTitle) {
    e.stopPropagation()
    setTitle(e.target.value)
}

function onColorDiv(e, setBgc) {
    e.stopPropagation()
    setBgc(e.target.id)
}

function onSetBgcColor(e, setColorMode) {
    e.stopPropagation()
    setColorMode(prevColorMode => !prevColorMode)
}

function onSetStarred(setIsStarred) {
    setIsStarred(prevIsStarred => !prevIsStarred)
}

function onTitleClick(e, noteMode, setNoteMode, setPlaceholder) {
    e.stopPropagation()
    setPlaceholder('Title')
    if(noteMode.isNoteTodos || noteMode.isNoteImage || noteMode.isNoteCanvas || noteMode.isNoteVideo) return
    setNoteMode(prevNoteMode => ({
        ...prevNoteMode,
        isClicked: true,
        isNoteText: true
    }))
}

function onFocusTxt(e) {
    e.stopPropagation()
    e.target.focus()
}

function onAddTodoNote(e, setNoteMode, setPlaceholder) {
    e.stopPropagation()
    setPlaceholder('Title')
    setNoteMode(prevNoteMode => ({
        ...prevNoteMode,
        isClicked: true,
        isNoteTodos: true
    }))
}

function onAddCanvasNote(e, setNoteMode) {
    e.stopPropagation()
    setNoteMode(prevNoteMode => ({
        ...prevNoteMode,
        isClicked: true,
        isNoteCanvas: true
    }))
}

function onAddImageNote(e, setNoteMode, setPlaceholder) {
    e.stopPropagation()
    setPlaceholder('Title')
    setNoteMode(prevNoteMode => ({
        ...prevNoteMode,
        isClicked: true,
        isNoteImage: true
    }))
}

function onAddVideoNote(e, setNoteMode, setPlaceholder) {
    e.stopPropagation()
    setPlaceholder('Title')
    setNoteMode(prevNoteMode => ({
        ...prevNoteMode,
        isClicked: true,
        isNoteVideo: true
    }))
}

function saveNote(noteMode, setNotes, isStarred, info, bgc) {
    if (noteMode.isNoteText) {
        let noteToSave = { type: 'NoteText', isStarred, createdAt: Date.now(), info: {...(info.title && { title: info.title }), ...(info.txt && { txt: info.txt }) }, 
        style: { backgroundColor: bgc } }

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
    } else if (noteMode.isNoteTodos) {
        let noteToSave = { type: 'NoteTodos', isStarred, createdAt: Date.now(), info: { ...(info.title && { title: info.title }), ...(info.todos && { todos: info.todos }) },
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
                console.log('Had issues saving the note', err)
            })
    } else if(noteMode.isNoteImage) {
        let noteToSave = { type: 'NoteImage', isStarred, createdAt: Date.now(), info: { ...(info.title && { title: info.title }), ...(info.url && { url: info.url }) },
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
            console.log('Had issues saving the note', err)
        })
    }
}

function handleTxtField(e, setTxt) {
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