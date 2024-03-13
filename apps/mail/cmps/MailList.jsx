const { Link } = ReactRouterDOM

import { MailPreview } from "./MailPreview.jsx"

export function MailList({ emails, onRemoveEmail, onUnread, onMarkEmail, onStarEmail }) {
    if (!emails.length) return <div>No Emails to show</div>

    return <ul className="email-list">
        {emails.map(email => <li key={email.id}>
            <div className="email-mark-actions">
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
                    {(email.isStared) ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </label>
                <input
                    type="checkbox" name="star" id={`star ${email.id}`}
                    style={{ display: 'none' }}
                    checked={email.isStared}
                    onChange={() => onStarEmail(email)}
                />
            </div>
            <Link to={`/email/${email.id}`}>
                <MailPreview email={email} />
            </Link>
            <div className="email-actions">
                <label htmlFor={`read ${email.id}`}>
                {(email.isRead) ? <i className="fa-regular fa-envelope-open"></i> : <i className="fa-regular fa-envelope"></i>}
                </label>
                <input
                    type="checkbox" name="read" id={`read ${email.id}`}
                    style={{ display: 'none' }}
                    checked={email.isStared}
                    onChange={() => onUnread(email)}
                />
                
                <button className="remove-btn" onClick={() => onRemoveEmail(email.id)}><i className="fa-regular fa-trash-can"></i></button>
            </div>
        </li>)}
    </ul>
}
