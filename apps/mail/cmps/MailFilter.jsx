const { useState, useEffect } = React

export function MailFilter({ onSetFilter , filterBy}) {
    const [filterByToEdit, setFilterByToEdit] = useState({})

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'checkbox':
                value = target.checked
                break
            }
            setFilterByToEdit({[field]: value })
    }

    return <section className="email-filter flex align-center">
        <form className="flex align-center space-between">

            <div className="txt-input-div flex align-center">
                <input type="text"
                    id="email-search"
                    name="txt"
                    value={filterBy.txt}
                    onChange={handleChange}
                    placeholder="Search"
                />
                <label htmlFor="email-search"><i className="fa-solid fa-magnifying-glass"></i></label>
            </div>

            <div className="checkbox-input-div">
                <input type="checkbox"
                    id="email-read"
                    name="isRead"
                    value={filterBy.isRead}
                    onChange={handleChange}
                />
                <label htmlFor="email-read">Unread</label>
            </div>

            <div className="checkbox-input-div">
                <input type="checkbox"
                    id="email-star"
                    name="isStared"
                    value={filterBy.isStared}
                    onChange={handleChange}
                />
                <label htmlFor="email-star">Starred</label>
            </div>

            <div className="txt-input-div flex align-center">
                <input type="text"
                    id="email-label"
                    name="labels"
                    value={filterBy.labels}
                    onChange={handleChange}
                    placeholder="space separated labels "
                />
                <label htmlFor="email-label"><i className="fa-solid fa-tags"></i></label>
            </div>

        </form>
    </section>
}