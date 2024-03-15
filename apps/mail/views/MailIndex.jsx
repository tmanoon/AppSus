const { useState, useEffect } = React
const { Link, useParams, useSearchParams, Outlet, useLocation } = ReactRouterDOM

import { MailFilter } from './../cmps/MailFilter.jsx'
import { MailFolder } from './../cmps/MailFolder.jsx'
import { MailList } from './../cmps/MailList.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'

import { emailService } from './../services/mail.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function MailIndex() {
    const { emailId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const path = location.pathname
    var pathWithId

    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getFilterFromParams(searchParams))

    if (emailId) pathWithId = '/mail/' + emailId

    useEffect(() => {
        setSearchParams(filterBy)
        loadEmails()
    }, [filterBy])

    function onSetFilter(fieldsToUpdate) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
    }

    function loadEmails() {
        emailService.query(filterBy)
            .then((emails) => {
                setEmails(emails)
            })
    }

    function onRemoveEmail(emailId) {
        emailService.remove(emailId)
            .then(() => {
                loadEmails()
                showSuccessMsg(`email removed successfully (${emailId})`)
            })
            .catch((err) => {
                showErrorMsg(`Could not remove (${emailId})`)
            })
    }

    function onUnread(email) {
        emailService.toggle('isRead', email)
            .then(() => loadEmails())
    }

    function onMarkEmail(email) {
        emailService.toggle('isMarked', email)
            .then(() => loadEmails())
    }

    function onStarEmail(email) {
        emailService.toggle('isStared', email)
            .then(() => loadEmails())
    }

    function restoreEmail(email) {
        emailService.toggle('status', email)
        .then(() => loadEmails())
    }

    if (!emails) return <div className="flex center"><div>loading...</div></div>
    return <section className="email-index grid">

        <Link to="/mail/compose"><button className="compose-btn">Compose</button></Link>

        <MailFilter
            onSetFilter={onSetFilter}
            filterBy={filterBy}
        />

        <MailFolder
            onSetFilter={onSetFilter}
        />

        {path === '/mail' && <MailList
            emails={emails}
            onSetFilter={onSetFilter}
            onRemoveEmail={onRemoveEmail}
            onUnread={onUnread}
            onMarkEmail={onMarkEmail}
            onStarEmail={onStarEmail}
        />}

        {path === pathWithId && <MailDetails
            onRemoveEmail={onRemoveEmail}
            onUnread={onUnread}
            onStarEmail={onStarEmail}
            restoreEmail={restoreEmail}
        />}

        {path === '/mail/compose' && <Outlet />}
    </section >
}

