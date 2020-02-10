/** React component which show a single event
 * 
 */
class EventCard extends React.Component{

    constructor(props){
        super(props);

        // Convert the datetime in the appropriate format
        const startTime = this.convertDatetime(this.props.startTime);
        const endTime = this.convertDatetime(this.props.endTime);
        const timing = this.getFormattedTiming(startTime, endTime);
        const createTime = this.convertDatetimeToString(this.convertDatetime(this.props.createTime));
        this.state = {
            yes: this.props.yes,
            no: this.props.no,
            maybe: this.props.maybe,
            activated: 0,
            createTime,
            timing,
        }

    }    
    

    render(){
        const total = parseInt(this.state.yes) + parseInt(this.state.no) + parseInt(this.state.maybe);

        return (
        <div className="card event-card">
            {/* If groupName is undefined, this means the user is already accessing an event in a particular group
              * In this case, we leave the group name empty */}
            {this.props.groupName !== undefined? this.props.groupName : "" } <br />

            {/* Event's name */}
            <span className="name">{this.props.eventName}</span> <br />
            
            <span style={ {"color": "grey",}}>
                Created on <b> {this.state.createTime}  </b> <br />
                {/*Created by <b> {this.props.creator} </b> <br />*/}
            </span>
            <hr />

            {/* Start and end time of the event */}
            <span className="name">{this.state.timing}</span> <br />
            <span className="faded-text">{this.props.description}</span> 
            <hr />
            
            {/* Votes */}
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

    /* To convert a datetime into and array
    * In returned array, ar[0] = year, ar[1] = month, .. and so on from greatest to smallest
    */
    convertDatetime(date){
        
        // Add the date first
        let toReturn = [
            date.slice(0, 4),
            date.slice(5, 7),
            date.slice(8,10)           
        ];

        //Convert time to 12 hour format
        let hr = parseInt(date.slice(11, 13));
        let min = date.slice(14,16);
        let amOrPm = "";
        if(hr > 12){
            hr = hr % 12;
            amOrPm = 'PM';
        }
        else if(hr === 12){
            amOrPm = 'PM';
        }
        else{
            amOrPm = 'AM';
        }
        
        toReturn.push(hr, min, amOrPm);

        return toReturn;
    }

    // Converts the sliced datetime to a string
    convertDatetimeToString(dt){
        return `${dt[2]}/${dt[1]}/${dt[0]}, ${dt[3]}:${dt[4]} ${dt[5]}`;
    }

    /* Takes the startTime and endTime in arrays and convert it into a string that has to be displayed
    */
    getFormattedTiming(st, et){ 
        // If date is equal
        if(st[0] === et[0] && st[1] === et[1] && st[2] === et[2]){
            return `${st[3]}:${st[4]} ${st[5]}-${et[3]}:${et[4]} ${et[5]}, ${st[2]}/${st[1]}/${st[0]}`;
        }
        else{
            return `${st[2]}/${st[1]}/${st[0]}, ${st[3]}:${st[4]} ${st[5]} to ${et[2]}/${et[1]}/${et[0]}, ${et[3]}:${et[4]} ${et[5]}`;
        }
    }
}
