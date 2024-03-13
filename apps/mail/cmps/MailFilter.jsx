const { useState, useEffect } = React

export function MailFilter({ onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
                value = +value
                break
            case 'checkbox':
                value = target.checked
                break
        }
        console.log('value:',value)
        setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
    }

    return <section className="email-filter flex align-center">
        <form className="flex align-center space-between">
            <div>
            <input type="text"
                id="email-search"
                name="txt"
                value={filterByToEdit.txt}
                onChange={handleChange}
                placeholder="Search"
            />
            <label htmlFor="email-search"><i className="fa-solid fa-magnifying-glass"></i></label>
            </div>
            <div>
            <input type="checkbox"
                id="email-read"
                name="isRead"
                value={filterBy.isRead}
                onChange={handleChange}
            />
            <label htmlFor="email-read">Unread</label>
            </div>
            <div>
            <input type="checkbox"
                id="email-star"
                name="isStared"
                value={filterByToEdit.isStared}
                onChange={handleChange}
            />
            <label htmlFor="email-star">Stared</label>
            </div>
            <div>
            <input type="text"
                id="email-label"
                name="labels"
                value={filterByToEdit.labels}
                onChange={handleChange}
                placeholder="space separated labels "
            />
            <label htmlFor="email-label"><i className="fa-solid fa-tags"></i></label>
            </div>
        </form>
    </section>
}