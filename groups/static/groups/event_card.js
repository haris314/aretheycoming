/** React component which shows a single event
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

        // Setup the websocket
        var loc = window.location        
        var wsStart = 'ws://';
        if (loc.protocol === 'https:')
            wsStart = 'wss://';
        var endpoint = wsStart + loc.host +  '/ws/event';
        this.socket = new ReconnectingWebSocket(endpoint)

        this.socket.onmessage = (e) =>{
            console.log("message", e);
            const voteCounts = JSON.parse(e.data);
            this.setState(() => ({
                yes: voteCounts['1'],
                no: voteCounts['2'],
                maybe: voteCounts['3'],
            }))
        }
        this.socket.onopen = (e) =>{
            console.log("open", e);
        }
        this.socket.onerror = (e) =>{
            console.log('error', e);
        }
        this.socket.onclose = (e) =>{
            console.log('close', e);
        }

        
    }    
    

    render(){
        const total = parseInt(this.state.yes) + parseInt(this.state.no) + parseInt(this.state.maybe); // Total votes

        const voteColors =['lightgreen', 'pink', 'peachpuff'];
        const votingArea = (
            <div>
                <hr />
                Let others know about you? <br />

                {/* The voting menu */}
                <button data-number='1' onClick={this.sendVote} className={(this.state.activated == 1? "vote-btn-activated" : "vote-btn") + " btn"} style={{'backgroundColor': voteColors[0]}}>Yes</button>
                <button data-number='2' onClick={this.sendVote} className={(this.state.activated == 2? "vote-btn-activated" : "vote-btn") + " btn"} style={{'backgroundColor': voteColors[1]}}>No</button>
                <button data-number='3' onClick={this.sendVote} className={(this.state.activated == 3? "vote-btn-activated" : "vote-btn") + " btn"} style={{'backgroundColor': voteColors[2]}}>Maybe</button>
            </div>
        )

        // Setting the description
        let desc;        
        if(this.props.description.length > 10){
            desc = (<div style={ {'color': 'grey',} }>{this.props.description}</div> );
        }
        else{
            desc = "";
        }
        
        // CSS
        const sideways = {
            'fontSize': '10px',
            'lineHeight': '10px',
            'height': '25px',
            'width': '20px',
            'writingMode': 'tb-rl',
            'transform': 'rotate(-180deg)',            
        };

        return (
        <div className="card event-card">
            {/* If groupName is undefined, this means the user is already accessing an event in a particular group
              * In this case, we leave the group name empty */}
            {this.props.groupName !== undefined? <a href={this.props.groupLink}>{this.props.groupName}</a> : "" } <br />

            {/* Event's name */}
            <span className="name">{this.props.eventName}</span> <br />
            
            <span style={{"color": "grey", "marginTop": "0px"}}>
               <h5 style={{"marginTop": "-10px", "marginBottom": "0px",}}> Created on <b> {this.state.createTime}  </b> <br /> </h5>
                {/*Created by <b> {this.props.creator} </b> <br />*/}
            </span>
            <hr />

            {/* Timing of the event */}
            <span className="name" >{this.state.timing}</span > <br />

            {/* Description */}
            {desc}
            <hr />
            
            {/* Votes */}
            
            <div style={{'display':'flex'}}>
                <div style={sideways}>Yes</div>
                <div style={ {'height': '25px', 'width': ((parseInt(this.state.yes) / total)*90) + "%", 'backgroundColor': 'lightgreen', 'border': 'solid white 1px', 'marginTop': 'auto'} }></div>
                <div style={ {'fontSize': '10px' }}>
                        {parseInt(this.state.yes)} <br /> ({total === 0? 0: Math.round((parseInt(this.state.yes) / total) * 100)}%)
                </div>
            </div>
            <div style={{'display':'flex'}}>
                <div style={sideways}>No</div>
                <div style={ {'height': '25px', 'width': ((parseInt(this.state.no) / total)*90) + "%", 'backgroundColor': 'pink', 'border': 'solid white 1px', 'marginTop': 'auto'} }></div>
                <div style={ {'fontSize': '10px' }}>
                    {parseInt(this.state.no)} <br /> ({total === 0? 0: Math.round((parseInt(this.state.no) / total) * 100)}%)
                </div>
            </div>
            <div style={{'display':'flex'}}>
                <div style={sideways}>May be</div>
                <div style={ {'height': '25px', 'width': ((parseInt(this.state.maybe) / total)*90) + "%", 'backgroundColor': 'peachpuff', 'border': 'solid white 1px', 'marginTop': 'auto'} }></div>
                <div style={ {'fontSize': '10px' }}>
                    {parseInt(this.state.maybe)} <br /> ({total === 0? 0: Math.round((parseInt(this.state.maybe) / total) * 100)}%)
                </div>
            </div>

            {/*Show the voting menu only if it is an active event */}
            {(this.props.active === true) && (this.props.memberFlag === true)? votingArea: this.props.active}
            
        </div>
        );
    }

    /* When someone votes in the event
     * Send to the backend and change state.activated
     */
    sendVote = (event) =>{
        const number = parseInt(event.target.dataset.number);
        var toSend = JSON.stringify({'vote': number, 'eventId': this.props.eventId})
        this.socket.send(toSend); // Send vote
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
            return `${st[2]}/${st[1]}/${st[0]}, ${st[3]}:${st[4]} ${st[5]} - ${et[2]}/${et[1]}/${et[0]}, ${et[3]}:${et[4]} ${et[5]}`;
        }
    }
}
