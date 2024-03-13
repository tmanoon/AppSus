const { Link } = ReactRouterDOM

import { MailPreview } from "./MailPreview.jsx"

export function MailList({ emails, onRemoveEmail, onMarkEmail, onStarEmail }) {
    if (!emails.length) return <div>No Emails to show</div>

    return <ul className="email-list">
        {emails.map(email => <li key={email.id}>
            <div className="email-mark-actions">
                <input type="checkbox" name="mark" onChange={() => onMarkEmail(email)} />
                <input type="checkbox" name="star" onChange={() => onStarEmail(email)} />
            </div>
            <Link to={`/email/${email.id}`}>
                <MailPreview email={email} />
            </Link>
            <div className="email-actions">
                <button className="remove-btn" onClick={() => onRemoveEmail(email.id)}>X</button>
                <button >Increase speed</button>
            </div>
        </li>)}
    </ul>
}
