const { useState, useEffect, useRef } = React

export function NoteHeader({ onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isNavOpened, setNavMode] = useState(false)
    const searchRef = useRef()

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') value = +value // If I ever want to add more filters
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
    }

    function onShowMenu(e) {
        e.stopPropagation()
        setNavMode(isNavOpened => !isNavOpened)
    }

    function onRemovedNotes(e) {
        e.stopPropagation()
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, search: 'isDeleted' }))
    }

    function onTodosNotes(e) {
        e.stopPropagation()
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, search: 'NoteTodos' }))
    }
    function onImgNotes(e) {
        e.stopPropagation()
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, search: 'NoteImage' }))
    }

    function onTxtNotes(e) {
        e.stopPropagation()
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, search: 'NoteText' }))
    }

    function onHomeClick(e) {
        e.stopPropagation()
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, search: '' }))
    }

    return <section className="note-header flex column">
        <div className="search-and-logo flex align-center space-between">
            <div className="header-details header-details flex align-center">
                <button className="btn btn-hamburger" onClick={onShowMenu}></button>
                <img className="note-header-img" onClick={onHomeClick} src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" />
                <h1 className="header-logo" onClick={onHomeClick}>Keep</h1>
            </div>
            <div className="header-search flex space-between align-center">
                <div className="search-span-container flex align-center justify-center"><span className="span-search"></span></div>
                <input type='text' ref={searchRef} placeholder="Search" name='search' value={filterBy.search} onChange={handleChange} />
            </div>
        </div>
        <nav className="side-nav flex column">
            <div className="flex nav-icon-txt"><span className="nav-span deleted-notes" onClick={onRemovedNotes}></span>{isNavOpened && <div>Deleted Notes</div>}</div>
            <div className="flex nav-icon-txt"><span className="nav-span todos-notes" onClick={onTodosNotes}></span>{isNavOpened && <div>Todos Notes</div>}</div>
            <div className="flex nav-icon-txt"><span className="nav-span img-notes" onClick={onImgNotes}></span>{isNavOpened && <div>Image Notes</div>}</div>
            <div className="flex nav-icon-txt"><span className="nav-span txt-notes" onClick={onTxtNotes}></span>{isNavOpened && <div>Text Notes</div>}</div>
        </nav>
    </section>
}
