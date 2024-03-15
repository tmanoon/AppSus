// mail service
import { utilService } from './../../../services/util.service.js'
import { storageService } from './../../../services/async-storage.service.js'
import { storageFuncsService } from './../../../services/storage.service.js'

export const emailService = {
    query,
    get,
    remove,
    save,
    toggle,
    read,
    getEmptyEmail,
    getDefaultFilter,
    getFilterFromParams
}

window.cs = emailService  // For Debug only

// const email = {
//     id: 'e101',
//     subject: 'Miss you!',
//     body: 'Would love to catch up sometimes',
//     isRead: false,
//     isStared: null,
//     isMarked: false,
//     sentAt: 1551133930594,
//     removedAt: null,
//     from: 'momo@momo.com',
//     to: 'user@appsus.com',
//     status: 'inbox',  //inbox/sent/trash/drafts
//     labels: []
// }

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}
const EMAIL_KEY = 'emails'

_createEmails()

function query(filterBy = getFilterFromParams(new URLSearchParams(window.location.search))) {
    return storageService.query(EMAIL_KEY)
        .then(emails => {
            if (filterBy.status && filterBy.status !== 'all-mail') {
                const regex = new RegExp(filterBy.status, 'i')
                emails = emails.filter(email => regex.test(email.status))
            }
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                emails = emails.filter(email => regex.test(email.subject) || regex.test(email.body) || regex.test(email.from) || regex.test(email.to))
            }
            if (filterBy.isRead) {
                emails = emails.filter(email => !email.isRead)
            }
            if (filterBy.isStared) {
                emails = emails.filter(email => email.isStared)
            }
            if (filterBy.labels) {
                const labelArr = filterBy.labels.split(' ')
                if (labelArr > 0)
                    emails = emails.filter(email => filterBy.labels.every(label => email.labels.includes(label)))
            }
            return emails.sort((a, b) => b.sentAt - a.sentAt)
        })
}

function get(emailId) {
    return storageService.get(EMAIL_KEY, emailId)
        .then(email => _setNextPrevEmailId(email))
    // return axios.get(EMAIL_KEY, emailId)
}

function remove(emailId) {
    return storageService.get(EMAIL_KEY, emailId)
        .then(email => {
            if (email.status !== 'trash') {
                email.status = 'trash'
                return storageService.put(EMAIL_KEY, email)
            } else return storageService.remove(EMAIL_KEY, emailId)
        })
}

function save(email) {
    return storageService.query(EMAIL_KEY).then(entities => {
        const idx = entities.findIndex(entity => entity.id === email.id)
        if (idx < 0) {
            return storageService.post(EMAIL_KEY, email)
        } else {
            return storageService.put(EMAIL_KEY, email)
        }
    })
}

function toggle(keyName, email) {
    if (keyName === 'status') email[keyName] = 'inbox'
    else email[keyName] = !email[keyName]
    return storageService.put(EMAIL_KEY, email)
}

function read(email) {
    if (!email.isRead) email.isRead = true
    return storageService.put(EMAIL_KEY, email)
}

function getEmptyEmail(status = 'drafts') {
    return {
        id: 'e' + utilService.makeId(),
        subject: '',
        body: '',
        isRead: true,
        isStared: false,
        isMarked: false,
        sentAt: new Date().getTime(),
        removedAt: null,
        from: (status === 'drafts' || status === 'sent') ? loggedinUser.email : '',
        to: '',
        status,  //inbox/sent/trash/drafts
        labels: []
    }
}

function getDefaultFilter() {
    return {
        status: 'inbox',  //inbox/sent/trash/drafts
        txt: '',
        isRead: false, //true/false
        isStared: false,  //true/false
        labels: ''
    }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        status: searchParams.get('status') || defaultFilter.status,
        txt: searchParams.get('txt') || defaultFilter.txt,
        isRead: searchParams.get('isRead') === 'true' || defaultFilter.isRead,
        isStared: searchParams.get('isStared') === 'true' || defaultFilter.isStared,
        labels: searchParams.get('labels') || defaultFilter.labels
    }
}

function _createEmails() {
    let emails = storageFuncsService.loadFromStorage(EMAIL_KEY)
    if (!emails || !emails.length) {
        emails = []
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        emails.push(_createEmail())
        storageFuncsService.saveToStorage(EMAIL_KEY, emails)
    }
}

function _createEmail() {
    const statusOps = ['inbox', 'sent', 'trash']
    const status = statusOps[utilService.getRandomIntInclusive(0, 2)]
    const email = getEmptyEmail(status)
    email.subject = utilService.makeLorem(5)
    email.body = utilService.makeLorem(50)
    email.sentAt = utilService.getRandomIntInclusive(1577839200000, new Date().getTime())
    email.isRead = utilService.getRandomIntInclusive(0, 1) > 0.5
    if (status === 'sent') {
        email.to = utilService.getRandomEmail()
        email.isRead = true
    } else if (status === 'inbox') {
        email.from = utilService.getRandomEmail()
        email.to = loggedinUser.email
        email.isStared = utilService.getRandomIntInclusive(0, 1) > 0.8
    } else {
        if (utilService.getRandomIntInclusive(0, 1) > 0.5) {
            email.to = utilService.getRandomEmail()
            email.from = loggedinUser.email
        } else {
            email.to = loggedinUser.email
            email.from = utilService.getRandomEmail()
        }
    }
    return email
}

function _setNextPrevEmailId(email) {
    return storageService.query(EMAIL_KEY).then((emails) => {
        const emailIdx = emails.findIndex((curremail) => curremail.id === email.id)
        const nextEmail = emails[emailIdx + 1] ? emails[emailIdx + 1] : emails[0]
        const prevEmail = emails[emailIdx - 1] ? emails[emailIdx - 1] : emails[emails.length - 1]
        email.nextEmailId = nextEmail.id
        email.prevEmailId = prevEmail.id
        return email
    })
}