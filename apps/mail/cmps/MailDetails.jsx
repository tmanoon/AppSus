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
            <button onClick={() => navAround('back')}><span>Back</span><i className="fa-solid fa-arrow-left"></i></button>
            <button onClick={() => { onRemoveEmail(email); navAround('back') }}><span>Delete</span><i className="fa-regular fa-trash-can"></i></button>
            {!email.removed && <button><span>Labels</span><i className="fa-solid fa-tags"></i></button>}
            {email.removed && <button onClick={() => restoreEmail(email)}><span>Restore message</span><i className="fa-solid fa-trash-arrow-up"></i></button>}
            <button onClick={() => onUnread(email)}><span>Mark as unread</span><i className="fa-regular fa-envelope"></i></button>
            {(email.isStarred) ?
                <button onClick={() => onStarEmail(email)}><span>Star</span><i className="fa-solid fa-star"></i></button> :
                <button onClick={() => onStarEmail(email)}><span>Star</span><i className="fa-regular fa-star"></i></button>}
            <button onClick={() => navAround('prev')}><i className="fa-solid fa-chevron-left"></i></button>
            <button onClick={() => navAround('next')}><i className="fa-solid fa-chevron-right"></i></button>
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

                <div className="star">
                    <label htmlFor="star">
                        {(email.isStarred) ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                    </label>
                    <input
                        type="checkbox" name="star" id="star"
                        style={{ display: 'none' }}
                        checked={email.isStarred}
                        onChange={() => onStarEmail(email)}
                    />
                </div>

                <Link to={`/mail/compose`}><button><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
                <Link to="/note"><button><span>send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
            </section>
        </div>

        <p>{email.body}</p>

        <section className="bottom-btns flex justify-center">
            <Link to={`/mail/compose`}><button><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
            <Link to="/note"><button><span>send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
        </section>
        
    </section>
}