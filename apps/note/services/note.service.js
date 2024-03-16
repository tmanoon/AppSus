import { utilService } from './../../../services/util.service.js'
import { storageService } from './../../../services/async-storage.service.js'
import { storageFuncsService } from './../../../services/storage.service.js'

const NOTES_KEY = 'notesDB'
const DELETED_NOTED_KEY = 'deletedNotesDB'
let removedNotes = []

_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
    getDefaultFilter,
    getFilterFromParams
}
// For Debug only
window.ns = noteService


function query(filterBy = getDefaultFilter()) {

    if (filterBy.type !== 'deleted') {
        return storageService.query(NOTES_KEY)
            .then(notes => {
                if (filterBy.search) {
                    const regex = new RegExp(filterBy.search, 'i')
                    notes = notes.filter(note => {
                        return regex.test(note.type) ||
                            (note.info.title && regex.test(note.info.title)) ||
                            (note.info.url && regex.test(note.info.url)) ||
                            (note.info.txt && regex.test(note.info.txt)) ||
                            (note.info.todos && note.info.todos.some(todo => regex.test(todo.txt) || (todo.title && regex.test(todo.title))))
                    })
                }
                notes.sort((firstNote, secondNote) => {
                    if (firstNote.isStarred && !secondNote.isStarred) {
                        return -1
                    } else if (!firstNote.isStarred && secondNote.isStarred) {
                        return 1
                    } else {
                        return 0
                    }
                })
                return notes
            })
    } else {
        return storageService.query(DELETED_NOTED_KEY)
            .then(notes => {
                if (filterBy.search) {
                    const regex = new RegExp(filterBy.search, 'i')
                    notes = notes.filter(note => {
                        return regex.test(note.type) ||
                            (note.info.title && regex.test(note.info.title)) ||
                            (note.info.url && regex.test(note.info.url)) ||
                            (note.info.txt && regex.test(note.info.txt)) ||
                            (note.info.todos && note.info.todos.some(todo => regex.test(todo.txt) || (todo.title && regex.test(todo.title))))
                    })
                }
                notes.sort((firstNote, secondNote) => {
                    if (firstNote.isStarred && !secondNote.isStarred) {
                        return -1
                    } else if (!firstNote.isStarred && secondNote.isStarred) {
                        return 1
                    } else {
                        return 0
                    }
                })
                return notes
            })
    }

}


function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => _setNextPrevNoteId(note))
    // return axios.get(NOTES_KEY, noteId)
}

function remove(noteId) {
    get(noteId)
        .then(noteToDelete => {
            noteToDelete.isDeleted = true
            removedNotes.push(noteToDelete)
            storageFuncsService.saveToStorage(DELETED_NOTED_KEY, removedNotes)
        })
        .catch(err => console.log)
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
    } else {
        const currLength = storageFuncsService.loadFromStorage(NOTES_KEY).length
        if (note.style) note = _createNote(note.type, note.isStarred, note.info, note.style)
        else note = _createNote(note.type, note.isStarred, note.info)
        return storageService.post(NOTES_KEY, note)
    }
}

function getEmptyNote() {
    return {
        createdAt: '',
        type: '',
        isStarred: '',
        style: {
            backgroundColor: utilService.getRandomColor()
        },
        info: {
        },
    }
}

function getDefaultFilter() {
    return { search: '', type: 'all' }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        search: searchParams.get('search') || defaultFilter.search,
        type: searchParams.get('type') || defaultFilter.type
    }
}

function _createNotes() {
    let notes = storageFuncsService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {
        notes = []
        notes.push(_createNote('NoteText', true, { title: `I'm a student in Coding Academy`, txt: 'Fullstack Me Baby!' }, '', 1112222))
        notes.push(_createNote('NoteText', true, { txt: 'Fullstack Me Baby!' }, '', 1112222))
        notes.push(_createNote('NoteImage', false, { url: 'https://games.moogaz.co.il/up/fireboy-and-watergirl-1-the-forest-temple.png', title: 'Mooni and Me' }))
        notes.push(_createNote('NoteTodos', false, { title: 'Get my stuff together', todos: [{ txt: 'Driving license', doneAt: null }, { txt: 'Coding power', doneAt: 187111111 }] }))
        notes.push(_createNote('NoteVideo', false, { url: 'https://vimeo.com/798326630', title: 'Smooth Criminal - Michael Jackson' }))
        notes.push(_createNote('NoteText', true, { title: `I'm a student in Coding Academy`, txt: 'Fullstack Me Baby!' }, '', 1112222))
        notes.push(_createNote('NoteText', true, { txt: 'Fullstack Me Baby!' }, '', 1112222))
        notes.push(_createNote('NoteVideo', false, { url: 'https://vimeo.com/348906914', title: 'The Beatles - In my life' }))
        notes.push(_createNote('NoteImage', false, { url: 'https://games.moogaz.co.il/up/fireboy-and-watergirl-1-the-forest-temple.png', title: 'Mooni and Me' }))
        notes.push(_createNote('NoteTodos', false, { title: 'Get my stuff together', todos: [{ txt: 'Driving license', doneAt: null }, { txt: 'Coding power', doneAt: 187111111 }] }))
        notes.push(_createNote('NoteVideo', false, { url: 'https://vimeo.com/14639124', title: 'נינט - היא יודעת' }))

        storageFuncsService.saveToStorage(NOTES_KEY, notes)
    }
}

function _createNote(type, isStarred, info = {}, style = '', createdAt = Date.now()) {
    const note = getEmptyNote()
    note.id = utilService.makeId()
    note.type = type
    if (style.backgroundColor) note.style = { backgroundColor: style.backgroundColor }
    note.isStarred = isStarred
    note.createdAt = createdAt

    switch (type) {
        case 'NoteText':
            if (info.title) note.info.title = info.title
            note.info.txt = info.txt
            break
        case 'NoteImage':
            note.info.url = info.url
            note.info.title = info.title
            break
        case 'NoteTodos':
            note.info.title = info.title
            note.info.todos = info.todos
            break
        case 'NoteVideo':
            if (info.title) note.info.title = info.title,
                note.info.url = info.url
        default:
            break
    }

    return note
}
function _setNextPrevNoteId(note) {
    return storageService.query(NOTES_KEY).then((notes) => {
        const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
        const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
        const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
        note.nextNoteId = nextNote.id
        note.prevNoteId = prevNote.id
        return note
    })
}
