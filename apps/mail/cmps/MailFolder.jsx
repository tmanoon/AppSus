const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouter
const { useSearchParams } = ReactRouterDOM

export function MailFolder({ onSetFilter }) {

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterByToEdit, setFilterByToEdit] = useState({ status: searchParams.get('status') })
    const [currFolder, setCurrFolder] = useState(searchParams.get('status') || 'inbox')

    const folders = ['Inbox', 'Starred', 'Sent', 'Drafts', 'Trash', 'All-Mail']
    const icons = ["fa-solid fa-inbox", "fa-regular fa-star", "fa-regular fa-paper-plane", "fa-regular fa-file", "fa-regular fa-trash-can", "fa-solid fa-envelopes-bulk"]

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(val) {
        val = val.toLowerCase()
        if (val !== 'starred') {
            setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, ['status']: val, ['isStarred']: false }))
        } else {
            setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, ['isStarred']: prevFilterBy.isStarred = true, ['status']: 'all-mail' }))
        }
        navigate('/mail')
    }

    function onClickFolder(folder) {
        setCurrFolder(folder)
        handleChange(folder)
    }

    return <section className="email-folder">
        <ul className="flex column" >
            {folders.map((folder, idx) =>
                <li key={folder}>
                    {currFolder === folder.toLowerCase() && <button onClick={() => onClickFolder(folder)} className="flex"
                        style={{ backgroundColor: 'rgba(245, 245, 245, 0.568)' }}>
                        <i className={icons[idx]}></i><span>{folder}</span>
                    </button>}
                    {currFolder !== folder.toLowerCase() && <button onClick={() => onClickFolder(folder)} className="flex">
                        <i className={icons[idx]}></i><span>{folder}</span>
                    </button>}
                </li>
            )}
        </ul>
    </section>
}