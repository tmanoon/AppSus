const { useState } = React
const { useNavigate, useParams } = ReactRouter

import { emailService } from "../services/mail.service.js"

export function MailCompose() {
    const navigate = useNavigate()
    const [email, setEmail] = useState(emailService.getEmptyEmail)

    const handleChange = ({ target }) => {
        let { value, name: field, } = target
        setEmail(prevEmail => ({ ...prevEmail, [field]: value }))
    }

    console.log('email:', email)

    function saveToDrafts() {
        emailService.save(email)
            .then(leavePage)
    }

    function saveToSent() {
        if (!email.to) {
            console.log('email has no recipient')
            return
        }
        setEmail(prevEmail => ({ ...prevEmail, ['status']: 'sent' }))
        emailService.save(email)
            .then(savedEmail => {
                savedEmail.status = 'sent'
                return emailService.save(savedEmail)
            })
            .then(leavePage)
    }

    function sendToNotes() {
        emailService.save(email)
        // and send to notes!!!
        leavePage()
    }

    function leavePage() {
        navigate('/mail')
    }

    return <section className="email-compose">
        <div className="flex space-between">
            <button onClick={saveToDrafts} className="back-btn">Back</button>
            <h1>New Massage</h1>
            <button onClick={saveToDrafts} className="close-btn"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <form className="flex column">
            <input type="email"
                name="to"
                value={email.to}
                onChange={handleChange}
                placeholder="Recipients"
            />
            <input type="text"
                name="subject"
                value={email.subject}
                onChange={handleChange}
                placeholder="Subject"
            />
            <textarea rows="10" cols="70"
                name="body"
                value={email.body}
                onChange={handleChange}>
            </textarea>
        </form>
        <div className="actions-div flex space-between">
            <button onClick={saveToSent} className="save-btn">Send</button>
            <button onClick={sendToNotes} className="notes-btn">Send to notes</button>
            <button onClick={leavePage} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button>
        </div>
    </section>
}