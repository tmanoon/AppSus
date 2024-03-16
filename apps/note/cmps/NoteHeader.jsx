const { useState, useEffect } = React

export function NoteHeader({ onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isNavOpened, setNavMode] = useState(false)

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
    }

    function onRemovedNotes(e) {
        e.stopPropagation()
    }

    function onTodosNotes(e) {
        e.stopPropagation()
    }
    function onImgNotes(e) {
        e.stopPropagation()
    }

    function onTxtNotes(e) {
        e.stopPropagation()
    }

    return <section className="note-header flex column">
        <div className="search-and-logo flex align-center space-between">
            <div className="header-details header-details flex align-center">
                <button className="btn btn-search" onClick={onShowMenu}></button>
                <img className="note-header-img" src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" />
                <h1 className="header-logo">Keep</h1>
            </div>
            <div className="header-search flex space-between align-center">
                <div className="search-span-container flex align-center justify-center"><span className="span-search"></span></div>
                <input type='text' placeholder="Search" name='search' value={filterBy.search} onChange={handleChange} />
            </div>
        </div>
        <nav className="side-nav flex column">
            <div className="flex nav-icon-txt"><span className="nav-span deleted-notes" onClick={onRemovedNotes}></span><div>Deleted Notes</div></div>
            <div className="flex nav-icon-txt"><span className="nav-span todos-notes" onClick={onTodosNotes}></span><div>Todos Notes</div></div>
            <div className="flex nav-icon-txt"><span className="nav-span img-notes" onClick={onImgNotes}></span><div>Image Notes</div></div>
            <div className="flex nav-icon-txt"><span className="nav-span txt-notes" onClick={onTxtNotes}></span><div>Text Notes</div></div>
        </nav>
    </section>
}

// export function CarFilterDesc({ onSetFilter, filterBy }) {
// 	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

// 	useEffect(() => {
// 		onSetFilter(filterByToEdit)
// 	}, [filterByToEdit])


// 	function handleChange(ev) {
// 		let { value, name: field, type } = ev.target
// 		if (type === 'number') value = +value
// 		setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
// 	}

// 	const { desc } = filterByToEdit
// 	return <section className="car-filter">
// 		<label htmlFor="desc">Description</label>
// 		<input type="text"
// 			id="desc"
// 			name="desc"
// 			value={desc}
// 			onChange={handleChange}
// 			placeholder="By desc" />
// 	</section>
// }