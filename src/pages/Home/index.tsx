import React from 'react';

import { NavLink } from 'react-router-dom'

export default function Home() {
	return (
		<div className="mb-5">
			<div className="row">
				<img style={{ 'width': '340px' }} src='/favicon.svg'></img>

			</div>
			<div className="row">
				<div className="col">
					<div className="text-center">
						<h1 style={{ fontSize: '39px' }}>A gift with a story</h1>
					</div>
				</div>
			</div>
			<div className="row">
				<div style={{ 'width': '690px' }} className="col">
					<div className="text-center">
						<h4>DemeterGift uses the power of the Everscale infrastructure to create the most easy, transparent, fun and digital charity auction on the web!</h4>
					</div>
				</div>
			</div>
			<div className="row">
				<div style={{ width: '250px' }} className="col">
					<div style={{
						background: '#0BD6BE',
						textAlign: 'center',
						cursor: 'pointer',
						height: '73px',
						padding: '36px 0',
						width: '100%',
						margin: '0'
					}} className="card card-body">
						<NavLink to="/donation">
							<div className="card-body">Let’s donate!</div>
						</NavLink>
					</div>
				</div>
			</div>
			<div className="Event row">
				<img style={{ 'padding': '0' }} src="https://www.metisgift.com/Event/Panel.svg" />
				<img style={{ "position": "absolute", "bottom": "0" }} src="https://www.metisgift.com/Event/Group.svg" />
				<img style={{ "padding": "0px", "position": "absolute", "width": "56%", "marginTop": "10%" }} src="https://www.metisgift.com/Event/CharityText.svg" />
				<div className="card-body EventBTN">
					<NavLink to="/CreateEvents">
						<div>
							Start event
						</div>
					</NavLink>
				</div>
			</div>
		</div>
	);
}