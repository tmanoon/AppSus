const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

import { MailList } from './../cmps/MailList.jsx'
import { MailFilter } from './../cmps/MailFilter.jsx'
import { MailFolder } from './../cmps/MailFolder.jsx'

import { emailService } from './../services/mail.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function MailIndex() {
    const [searchParams, setSearchParams] = useSearchParams()

    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getFilterFromParams(searchParams))

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
                // console.log('emails (loadEmails):', emails)
            })
    }

    function onRemoveEmail(emailId) {
        emailService.remove(emailId)
            .then(() => {
                setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
                showSuccessMsg(`email removed successfully (${emailId})`)
            })
            .catch((err) => {
                console.log('Had issues removing email', err)
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

    if (!emails) return <div>loading...</div>
    return <section className="email-index grid">

        <Link to="/mail/compose"><button className="compose-btn">Compose</button></Link>

        <MailFilter
            onSetFilter={onSetFilter}
            filterBy={filterBy}
        />


        <MailFolder
            onSetFilter={onSetFilter}
            filterBy={filterBy}
        />


        <MailList
            emails={emails}
            onRemoveEmail={onRemoveEmail}
            onUnread={onUnread}
            onMarkEmail={onMarkEmail}
            onStarEmail={onStarEmail}
        />
    </section >
}

