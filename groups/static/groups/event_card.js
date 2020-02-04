/** React component which show a single event
 * 
 */
class EventCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            yes: this.props.yes,
            no: this.props.no,
            maybe: this.props.maybe,
        }
    }

    render(){
        const total = parseInt(this.state.yes) + parseInt(this.state.no) + parseInt(this.state.maybe);

        return (
        <div className="group-card">
            {this.props.groupName !== undefined? this.props.groupName : "" } <br />
            <span className="name">{this.props.eventName}</span> <br />
            
            <span className="faded-text">
                Created <b> {this.props.createTime}  </b> <br />
                Created by <b> {this.props.creator} </b> <br />
            </span>
            <hr />

            <span className="name">{this.props.startTime} to {this.props.endTime}</span> <br />
            <span className="faded-text">{this.props.description}</span> 
            <hr />
            
            <table className="vote-table">
                <thead>
                    <tr>
                        <th>Yes</th>
                        <th>No</th>
                        <th>Maybe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{parseInt(this.state.yes)}</td>
                        <td>{parseInt(this.state.no)}</td>
                        <td>{parseInt(this.state.maybe)}</td>
                    </tr>
                    <tr>
                        <td>{(parseInt(this.state.yes) / total) * 100}%</td>
                        <td>{(parseInt(this.state.no) / total) * 100}%</td>
                        <td>{(parseInt(this.state.maybe) / total) * 100}%</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            Let others know about you? <br />

            {/* The voting menu */}
            <button className="vote-btn btn">Yes</button>
            <button className="vote-btn btn">No</button>
            <button className="vote-btn btn">Maybe</button>

        </div>
        );
    }
}
