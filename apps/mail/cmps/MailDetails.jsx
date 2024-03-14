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

    function formatDate(timestamp) {
        const date = new Date(timestamp)
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
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
            <button onClick={() => navAround('back')}>Back</button>
            <button onClick={() => {onRemoveEmail(email.id); navAround('back')}}>Delete</button>
            {email.status !== 'trash' && <button>Labels</button>}
            {email.status === 'trash' && <button onClick={()=> restoreEmail(email)}>Restore to inbox</button>}
            <button onClick={() => onUnread(email)}>Mark as unread</button>
            <button onClick={() => onStarEmail(email)}>Star</button>
            <button onClick={() => navAround('prev')}><i className="fa-solid fa-chevron-left"></i></button>
            <button onClick={() => navAround('next')}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
        <h1>{email.subject}</h1>
        <div className="flex space-between">

            <section className="to-from flex column">
                <div className="flex">
                    <h4>{getNameFromEmail(email.from)}</h4><h5>{`<${email.from}>`}</h5>
                </div>
                <h5>To: {getNameFromEmail(email.to)}</h5>
            </section>

            <section className="sent-actions flex">
                <h5>{formatDate(email.sentAt)}</h5>

                <div className="star">
                    <label htmlFor="star">
                        {(email.isStared) ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                    </label>
                    <input
                        type="checkbox" name="star" id="star"
                        style={{ display: 'none' }}
                        checked={email.isStared}
                        onChange={() => onStarEmail(email)}
                    />
                </div>

                <Link to={`/mail/compose`}><button className="flex"><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
                <Link to="/note"><button className="flex"><span>send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
            </section>
        </div>
        <p>{email.body}</p>
        <section className="bottom-btns flex justify-center">
            <Link to={`/mail/compose`}><button className="flex"><span>Reply</span><i className="fa-solid fa-reply"></i></button></Link>
            <Link to="/note"><button className="flex"><span>send to notes</span><i className="fa-regular fa-note-sticky"></i></button></Link>
        </section>
    </section>
}