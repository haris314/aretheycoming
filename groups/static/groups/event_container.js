/** React component which will hold all the events
 * 
 */
class EventsContainer extends React.Component{    

    constructor(props){
        super(props);
    }

    render(){
        const list = [1, 2, 3];
        return (
        <div className="container">
            <div className="row flex-row">
                {list.map( (n, i) => (
                    <div className="col-sm-12 col-lg-6">
                        <EventCard key={i} 
                            eventName="Harruaness"
                            //groupName="Harru's group"
                            createTime="today at 00:00:00 AM"
                            creator="Harrua"
                            startTime="12:00 PM"
                            endTime="1:00 PM"
                            description="Get ready for Harruanessiness"
                            yes="10"
                            no="2"
                            maybe="13"
                            />
                    </div>
                ))}                          
                
            </div>
        </div>);
    }
}





