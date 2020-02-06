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
            activated: 0,
        }
    }

    render(){
        const total = parseInt(this.state.yes) + parseInt(this.state.no) + parseInt(this.state.maybe);

        return (
        <div className="group-card">
            {/* If groupName is undefined, this means the user is already accessing an event in a particular group
              * In this case, we leave the group name empty */}
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
            <button data-number='1' onClick={this.sendVote} className={(this.state.activated == 1? "vote-btn-activated" : "vote-btn") + " btn"}>Yes</button>
            <button data-number='2' onClick={this.sendVote} className={(this.state.activated == 2? "vote-btn-activated" : "vote-btn") + " btn"}>No</button>
            <button data-number='3' onClick={this.sendVote} className={(this.state.activated == 3? "vote-btn-activated" : "vote-btn") + " btn"}>Maybe</button>

        </div>
        );
    }

    /* When someone votes in the event
     * Send to the backend and change state.activated
     */
    sendVote = (event) =>{
        const number = parseInt(event.target.dataset.number);
        this.setState(() => ({
            activated: number,
        }));
    }
}
