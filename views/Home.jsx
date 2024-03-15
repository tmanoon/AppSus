
const { Link } = ReactRouterDOM

export function Home() {
    return <section className="home flex column center">
        <h2>Welcome to <Link to="/about"><span>MailMemo</span></Link> by <span>Shoval & Jenny</span>:</h2>
        <h3>The Ultimate Digital Workspace!</h3>
    </section>
}