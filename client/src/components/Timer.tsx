export default function Timer() {
	return (
		<>
			<div className="buttons">
				<button className="btn-group" id="start-timer">
					start
				</button>
				<button className="btn-group" id="stop-timer">
					pause
				</button>
			</div>
			<div className="display-time" id="display-time">
				00:00:00
			</div>
		</>
	);
}
