import React from 'react'

function NavBar() {
	return (
		<div>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/dashboard">Dashboard</Link>
				</li>
			</ul>
		</div>
	)
}

export default NavBar
