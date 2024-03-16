const { useState, useEffect } = React

export function NoteHeader({ onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') value = +value // If I ever want to add more filters
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
    }

    function onShowMenu() {

    }

    function onShowNotes(e) {
        e.stopPropagation()
    }

    function onShowMenu(e) {
        e.stopPropagation()
    }

    function onRemovedNotes(e) {
        e.stopPropagation()
    }

    return <section className="note-header flex align-center space-between">
        <div className="header-details">
            {/* <div className="menu-of-btn">
                <button className="btn all-notes" onClick={onShowNotes}></button>
                <button className="btn removed-notes-btn" onClick={onRemovedNotes}></button>
            </div> */}
            <button className="btn btn-search" onClick={onShowMenu}></button>
            <img className="note-header-img" src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" />
            <h1 className="header-logo">Keep</h1>
        </div>
        <div className="header-search flex space-between align-center">
            <div className="search-span-container flex align-center justify-center"><span className="span-search"></span></div>
            <input type='text' placeholder="Search" name='search' value={filterBy.search} onChange={handleChange} />
        </div>
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