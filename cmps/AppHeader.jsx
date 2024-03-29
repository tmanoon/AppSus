const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {

    return <header className="app-header flex space-between">
        <Link to="/">
            <h3 className="logo">MailMemo</h3>
        </Link>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">Mail</NavLink>
            <NavLink to="/note">Note</NavLink>
        </nav>
    </header>
}
