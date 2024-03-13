const { useState } = React
export function NoteHeader() {
    function onShowMenu() {

    }
    return <div className="note-header">
        <button className="btn btn-search" onClick={{onShowMenu}}>Menu</button>
        <img src='https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png'/>
        <h1>Keep</h1>
        <input type='text' placeholder="Search" name='q'/>
    </div>
}