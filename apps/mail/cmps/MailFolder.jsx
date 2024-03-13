const { useState, useEffect } = React

export function MailFolder({ onSetFilter, filterBy }) {

    const folders = ['Inbox', 'Starred', 'Sent', 'Drafts', 'Trash', 'All-Mail']
    const icons = ["fa-solid fa-inbox", "fa-regular fa-star", "fa-regular fa-paper-plane", "fa-regular fa-file", "fa-regular fa-trash-can", "fa-solid fa-envelopes-bulk"]

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [currFolder, setCurrFolder] = useState('inbox')

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(val) {
        val = val.toLowerCase()
        if (val !== 'starred') {
            setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, ['status']: val, ['isStared']: false }))
        } else {
            setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, ['isStared']: !prevFilterBy.isStared, ['status']: 'all-mail' }))
        }
    }

    function onClickFolder(folder) {
        setCurrFolder(folder)
        handleChange(folder)
    }

    return <section className="email-folder">
        <ul className="flex column">
            {folders.map((folder, idx) =>
                <li key={folder}>
                    {currFolder === folder && <button onClick={() => onClickFolder(folder)} className="flex"
                    style={{backgroundColor: 'rgba(245, 245, 245, 0.568)'}}>
                        <i className={icons[idx]}></i>{folder}
                    </button>}
                    {currFolder !== folder && <button onClick={() => onClickFolder(folder)} className="flex">
                        <i className={icons[idx]}></i>{folder}
                    </button>}
                </li>
            )}
        </ul>
    </section>
}