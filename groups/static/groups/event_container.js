/** React component which will hold all the events
 * 
 */
class EventsContainer extends React.Component{    
    
    constructor(props){
        super(props);
        this.state = {
            loaded: 0, //0: Still loading, 1: Loading failed, 2: Successfully loaded.
            events: [],
        }

        //Gotta see if i have to load the events of a group or that of a user

        if(this.props.groupId !== undefined){
            this.loadFromGroup();
        }
        else{
            this.loadForUser();
        }
        
    }

    render(){
        const list = [1, 2, 3];
        if(this.state.loaded === 0){ //Still loading
            return(
                <div className="container">
                    <div className="row">
                        <div className="loader"></div>
                </div>
            </div>
            )
        }
        else if(this.state.loaded === 1){ //Loading failed
            return(
                <div className="container">
                    <div className="row">
                        <div style = {{ color: "red", marginLeft: "15px"}}>
                            Sorry, there was a problem loading the events. Please try reloading the page.
                        </div>
                    </div>
                </div>
            )
        }
        else {
            // If there are no events, 
            if (this.state.events.length === 0){
                return(
                    <div className="container">
                    <div className="row">
                        <div style = {{ color: "green", marginLeft: "15px", marginTop: "15px", fontSize: "20px"}}>
                            No events to show right now...
                        </div>
                    </div>
                </div>
                )
            }
            // If everything else doesn't return anything, return the events
            return (
                <div className="container">
                    <div className="row flex-row">
                        {this.state.events.map( (event, i) => (
                            <div className="col-sm-12 col-lg-6">
                                <EventCard key = {i} 
                                    eventName = {event.name}
                                    groupName = {this.props.showGroupName? event.group_name: undefined}
                                    createTime = {event.create_time}
                                    active = {this.props.active}
                                    //creator = {event.creator_id}
                                    startTime = {event.start_time}
                                    endTime = {event.end_time}
                                    description = {event.description}

                                    // Extra stuff required for logic
                                    memberFlag = {this.props.memberFlag}
                                    groupLink = {`/groups/${event.group_id}`}

                                    //Votes
                                    yes="10"
                                    no="2"
                                    maybe="13"
                                    />
                            </div>
                        ))}                          
                        
                    </div>
                </div>
            );
        }
    }

    // Loads the events from a particular group
    loadFromGroup = () => {
        //Load the events from backend
        //Send request to the server to get events
        const request = new XMLHttpRequest();
        request.open('POST', `/groups/${groupId}/get_events`);
        const csrftoken = getCookie('csrftoken');
        request.setRequestHeader('X-CSRFToken', csrftoken);    

        request.onload = () =>{
            const response = JSON.parse(request.responseText);
            // console.log(response);
            if(response.success === false){
                this.setState(() => ({
                    loaded: false,
                }))
            }
            else{
                this.setState(() => ({
                    loaded: true,
                    events: response.events,
                }))
            }
        }   
        
        //Setup and send the request
        const data = new FormData();
        data.append('active', this.props.active);
        request.send(data);
    }

    // Loads events for a particular user
    loadForUser = () =>{
        //Load the events from backend
        //Send request to the server to get events
        const request = new XMLHttpRequest();
        request.open('POST', `/feed/get_events`);
        const csrftoken = getCookie('csrftoken');
        request.setRequestHeader('X-CSRFToken', csrftoken);    

        request.onload = () =>{
            const response = JSON.parse(request.responseText);
            // console.log(response);
            if(response.success === false){
                this.setState(() => ({
                    loaded: false,
                }))
            }
            else{
                this.setState(() => ({
                    loaded: true,
                    events: response.events,
                }))    
            }
        }   
        
        //Setup and send the request
        const data = new FormData();
        request.send(data);
    }
}





