import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTES_KEY = 'notesDB'
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
    console.log('filterBy', filterBy)

    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                notes = notes.filter(note => regex.test(note.vendor))
            }
            if (filterBy.minSpeed) {
                notes = notes.filter(note => note.maxSpeed >= filterBy.minSpeed)
            }
            if (filterBy.desc) {
                const regex = new RegExp(filterBy.desc, 'i')
                notes = notes.filter(note => regex.test(note.desc))
            }
            return notes
        })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => _setNextPrevNoteId(note))
    // return axios.get(NOTES_KEY, noteId)
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
    } else {
        note = _createNote(note.vendor, note.maxSpeed)
        return storageService.post(NOTES_KEY, note)
    }
}

function getEmptyNote() {
    return {
        createdAt: '',
        type: '',
        isPinned: '',
        style: {
            backgroundColor: utilService.getRandomColor()
        },
        info: {
        },
    }
}

function getDefaultFilter() {
    return { txt: '', minSpeed: 50, desc: '' }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        txt: searchParams.get('txt') || defaultFilter.txt,
        minSpeed: searchParams.get('minSpeed') || defaultFilter.minSpeed,
        desc: searchParams.get('desc') || defaultFilter.desc
    }
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {
        notes = []
        const numForId = notes.length + 1
        notes.push(_createNote(numForId++, 'NoteTxt', true, {backgroundColor: '#00d'}, {txt: 'Fullstack Me Baby!'}, 1112222))
        notes.push(_createNote(numForId++, 'NoteImg', false, {backgroundColor: '#00d'}, {url: 'http://some-img/me', title: 'Mooni and Me'}))
        notes.push(_createNote(numForId++, 'NoteTodos', false, {}, {title: 'Get my stuff together', todos: [{ txt: 'Driving license', doneAt: null }, { txt: 'Coding power', doneAt: 187111111 }]} ))
        utilService.saveToStorage(NOTES_KEY, notes)
    }
}

function _createNote(numForId, type, isPinned, style = {}, info = {}, createdAt = Date.now()) {
    const note = getEmptyNote()
    note.id = utilService.makeNoteId(numForId),
    note.type = type,
    note.isPinned = isPinned,
    note.style = style,
    note.info = info,
    note.createdAt = createdAt
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
