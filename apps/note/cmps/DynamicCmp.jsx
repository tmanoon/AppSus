import { NoteImage } from './NoteImage.jsx'
import { NoteText } from './NoteText.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'

export function DynamicCmp({ filterBy, note }) {
    switch (filterBy.search.toLowerCase()) {
        case 'txt' || 'text':
            return <NoteText note={note} />
        case 'img' || 'image':
            return <NoteImage note={note} />
        case 'todos' || 'to do' || 'to dos':
            return <NoteTodos note={note} />
        case 'video':
            return <NoteVideo note={note} />
        default:
            if (note.type === 'NoteText') return <NoteText note={note} />
            else if (note.type === 'NoteImage') return <NoteImage note={note} />
            else if (note.type === 'NoteTodos') return <NoteTodos note={note} />
            else if (note.type === 'NoteVideo') return <NoteVideo note={note} />
    }
}
