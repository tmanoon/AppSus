const { Link } = ReactRouterDOM

export function MailPreview({ email }) {
    var dispTime = ''
    const todayTimestamp = new Date().setHours(0, 0, 0, 0) // Timestamp for midnight today
    const yearTimestamp = new Date().setFullYear(new Date().getFullYear(), 0, 0) // Timestamp for beginning of current year

    if (email.sentAt >= todayTimestamp) {
        const hour = new Date(email.sentAt).getHours()
        const minute = new Date(email.sentAt).getMinutes()
        dispTime = new Date(email.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    } else if (email.sentAt >= yearTimestamp) {
        const month = new Date(email.sentAt).toLocaleString('en-us', { month: 'short' })
        const day = new Date(email.sentAt).getDate()
        dispTime = `${month} ${day}`

    } else {
        const dayOfMonth = new Date(email.sentAt).getDate()
        const monthOfYear = new Date(email.sentAt).getMonth() + 1 // Months are 0-indexed, so add 1
        const year = new Date(email.sentAt).getFullYear()
        dispTime = `${dayOfMonth}/${monthOfYear}/${year}`
    }

    const fromName = email.from.split('@')[0]
    const toName = email.to.split('@')[0]

    return < article className="email-preview grid" >
        {!email.isRead && email.status !== 'sent' && <h4>{fromName}</h4>}
        {email.isRead && email.status !== 'sent' && <h4 style={{ fontWeight: 'lighter' }}>{fromName}</h4>}
        {!email.isRead && email.status === 'sent' && <h4>To:{toName}</h4>}
        {email.isRead && email.status === 'sent' && <h4 style={{ fontWeight: 'lighter' }}>To:{toName}</h4>}
        <div className="email-short-disp flex align-center">
            {email.isRead && <h6 style={{ fontWeight: 'lighter' }}>{email.subject}</h6>}
            {!email.isRead && <h6>{email.subject}</h6>}
            <p>- {email.body}</p>
        </div>
        <p className="email-time-disp">{dispTime}</p>
    </article >
}