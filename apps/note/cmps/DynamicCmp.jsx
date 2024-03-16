import { NoteImg } from './NoteImg.jsx'
import { NoteTxt } from './NoteTxt.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'

export function DynamicCmp({ filterBy, note }) {
    switch (filterBy.search.toLowerCase()) {
        case 'txt' || 'text':
            return <NoteTxt note={note} />
        case 'img' || 'image':
            return <NoteImg note={note} />
        case 'todos' || 'to do' || 'to dos':
            return <NoteTodos note={note} />
        case 'video':
            return <NoteVideo note={note} />
        default:
            if(note.type === 'NoteTxt') return <NoteTxt note={note} />
            else if (note.type === 'NoteImg') return <NoteImg note={note} />
            else if (note.type === 'NoteTodos') return <NoteTodos note={note} />
            else if (note.type === 'NoteVideo') return <NoteVideo note={note} />
    }
}