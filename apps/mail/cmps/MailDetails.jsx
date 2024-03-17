const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouter
const { Link } = ReactRouterDOM

import { emailService } from "../services/mail.service.js"

export function MailDetails({ onRemoveEmail, onUnread, onStarEmail, restoreEmail }) {

    const navigate = useNavigate()
    const { emailId } = useParams()
    const [email, setEmail] = useState(emailService.get(emailId))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => loadEmail(), [emailId])

    function loadEmail() {
        setIsLoading(true)
        emailService.get(emailId)
            .then(email => emailService.read(email))
            .then(email => setEmail(email))
            .catch(err => {
                console.log(`Couldn't loading email`, err)
                navigate('/mail')
            })
            .finally(() => setIsLoading(false))
    }

    function formatDateLong(timestamp) {
        const date = new Date(timestamp)
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }
        return date.toLocaleString('en-US', options)
    }

    function formatDateShort(timestamp) {
        const date = new Date(timestamp)
        const options = {
            month: 'short',
            day: 'numeric'
        }
        return date.toLocaleString('en-US', options)
    }

    function getNameFromEmail(emailAddress) {
        emailAddress = emailAddress.split('@')
        return emailAddress[0]
    }

    function navAround(val) {
        if (val === 'next') navigate('/mail/' + email.nextEmailId)
        else if (val === 'prev') navigate('/mail/' + email.prevEmailId)
        else if (val === 'back') navigate('/mail')
    }

    if (isLoading) return <section className="email-details flex center"><div>Loading details..</div></section>
    return <section className="email-details">

        <div className="actions-bar flex space-between">
            <button onClick={() => navAround('back')} title="Back"><span>Back</span><i className="fa-solid fa-arrow-left"></i></button>
            <button onClick={() => { onRemoveEmail(email); navAround('back') }} title="Delete"><span>Delete</span><i className="fa-regular fa-trash-can"></i></button>
            {!email.removed && <button title="Labels"><span>Labels</span><i className="fa-solid fa-tags"></i></button>}
            {email.removed && <button onClick={() => restoreEmail(email)} title="Restore Message"><span>Restore message</span><i className="fa-solid fa-trash-arrow-up"></i></button>}
            <button onClick={() => onUnread(email)} title="Mark as unread"><span>Mark as unread</span><i className="fa-regular fa-envelope"></i></button>
            {(email.isStarred) ?
                <button onClick={() => onStarEmail(email)} title="Unstar"><span>Star</span><i className="fa-solid fa-star"></i></button> :
                <button onClick={() => onStarEmail(email)} title="Star"><span>Star</span><i className="fa-regular fa-star"></i></button>}
            <button onClick={() => navAround('prev')} title="Previous"><i className="fa-solid fa-chevron-left"></i></button>
            <button onClick={() => navAround('next')} title="Next"><i className="fa-solid fa-chevron-right"></i></button>
        </div>

        <h1>{email.subject}</h1>

        <div className="flex space-between">
            <section className="to-from flex column">
                <div className="flex">
                    <h4>{getNameFromEmail(email.from)}</h4>
                    <h5 className="large">{`<${email.from}>`}</h5>
                    <h5 className="small">{formatDateShort(email.sentAt)}</h5>
                </div>
                <h5>To: {getNameFromEmail(email.to)}</h5>
            </section>

            <section className="sent-actions flex">

                <h5 className="large">{formatDateLong(email.sentAt)}</h5>

                {(email.isStarred) ?
                <button onClick={() => onStarEmail(email)} title="Unstar"><i className="fa-solid fa-star"></i></button> :
                <button onClick={() => onStarEmail(email)} title="Star"><i className="fa-regular fa-star"></i></button>}

                <Link to={`/mail/compose`}><button title="Reply"><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
                <Link to="/note"><button title="Send to notes"><span>Send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
            </section>
        </div>

        <pre>{email.body}</pre>

        <section className="bottom-btns flex justify-center">
            <Link to={`/mail/compose`}><button><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
            <Link to="/note"><button><span>Send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
        </section>
        
    </section>
}