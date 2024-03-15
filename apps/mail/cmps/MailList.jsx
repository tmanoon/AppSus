const { useState , useEffect} = React
const { Link, useSearchParams } = ReactRouterDOM

import { MailPreview } from "./MailPreview.jsx"

export function MailList({ emails, onSetFilter, onRemoveEmail, onUnread, onMarkEmail, onStarEmail }) {

    const [searchParams, setSearchParams] = useSearchParams()
    const [sortBy, setSortBy] = useState({ sort: searchParams.get('sort'), dir: searchParams.get('dir') })
    const [currSorter, setCurrSorter] = useState({ sort: searchParams.get('sort'), dir: searchParams.get('dir') })

    useEffect(() => {
        onSetFilter(sortBy)
    }, [sortBy])

    function handleChange(val) {
        const key = (typeof val === 'string') ? 'sort' : 'dir'
         setSortBy((prevSortBy) => ({ ...prevSortBy, [key]: val }))
    }

    function onClickSort(val) {
        const key = (typeof val === 'string') ? 'sort' : 'dir'
        setCurrSorter((prevSortBy) => ({ ...prevSortBy, [key]: val }))
        handleChange(val)
    }

    function unreadCount() {
        const unreadCount = emails.filter(email => !email.isRead).length
        const allEmailsCount = emails.length
        return unreadCount + '/' + allEmailsCount
    }

    if (!emails.length || !emails) return <div className="email-list flex center"><div>No Emails to show</div></div>
    return <ul className="email-list">
        <li className="email-sort flex space-between">
            <div className="flex space-between">
            {currSorter.sort === 'date' && <button onClick={() => onClickSort('date')} style={{ backgroundColor: 'rgba(225, 224, 224, 0.8)' }}><span>Date</span></button>}
            {currSorter.sort !== 'date' && <button onClick={() => onClickSort('date')}><span>Date</span></button>}
            {currSorter.sort !== 'subject' && <button onClick={() => onClickSort('subject')}><span>Subject</span></button>}
            {currSorter.sort === 'subject' && <button onClick={() => onClickSort('subject')} style={{ backgroundColor: 'rgba(225, 224, 224, 0.8)' }}><span>Subject</span></button>}
            {currSorter.dir === true && <button onClick={() => onClickSort(true)} style={{ backgroundColor: 'rgba(225, 224, 224, 0.8)' }}><i className="fa-solid fa-chevron-up"></i></button>}
            {currSorter.dir !== true && <button onClick={() => onClickSort(true)}><i className="fa-solid fa-chevron-up"></i></button>}
            {currSorter.dir !== false && <button onClick={() => onClickSort(false)}><i className="fa-solid fa-chevron-down"></i></button>}
            {currSorter.dir === false && <button onClick={() => onClickSort(false)} style={{ backgroundColor: 'rgba(225, 224, 224, 0.8)' }}><i className="fa-solid fa-chevron-down"></i></button>}
            </div>
            <p>Unread: {unreadCount()}</p>
        </li>
        {emails.map(email => <li key={email.id} className="grid">
            <div className="email-mark-actions flex align-center">

                <label htmlFor={`mark ${email.id}`}>
                    {(email.isMarked) ? <i className="fa-regular fa-square-check"></i> : <i className="fa-regular fa-square"></i>}
                </label>
                <input
                    type="checkbox" name="mark" id={`mark ${email.id}`}
                    style={{ display: 'none' }}
                    checked={email.isMarked}
                    onChange={() => onMarkEmail(email)}
                />

                <label htmlFor={`star ${email.id}`}>
                    {(email.isStarred) ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </label>
                <input
                    type="checkbox" name="star" id={`star ${email.id}`}
                    style={{ display: 'none' }}
                    checked={email.isStarred}
                    onChange={() => onStarEmail(email)}
                />
            </div>

            <Link to={`/mail/${email.id}`}>
                <MailPreview email={email} />
            </Link>

            <div className="email-actions flex center">
                <label htmlFor={`read ${email.id}`}>
                    {(email.isRead) ? <i className="fa-regular fa-envelope-open"></i> : <i className="fa-regular fa-envelope"></i>}
                </label>
                <input
                    type="checkbox" name="read" id={`read ${email.id}`}
                    style={{ display: 'none' }}
                    checked={email.isRead}
                    onChange={() => onUnread(email)}
                />

                <button className="remove-btn" onClick={() => onRemoveEmail(email.id)}><i className="fa-regular fa-trash-can"></i></button>
            </div>
        </li>)}
    </ul>
}
