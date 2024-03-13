import { NoteImg } from './NoteImg.jsx'
import { NoteTxt } from './NoteTxt.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'

export function DynamicCmp({ filterBy, note }) {
    switch (filterBy.type) {
        case 'NoteTxt':
            return <NoteTxt note={note} />
        case 'NoteImg':
            return <NoteImg note={note} />
        case 'NoteTodos':
            return <NoteTodos note={note} />
        case 'NoteVideo':
            return <NoteVideo note={note} />
        case '':
            if(note.type === 'NoteTxt') return <NoteTxt note={note} />
            else if (note.type === 'NoteImg') return <NoteImg note={note} />
            else if (note.type === 'NoteTodos') return <NoteTodos note={note} />
            else if (note.type === 'NoteVideo') return <NoteVideo note={note} />
    }
}