// Get username
const username = document.querySelector("#data-items").dataset.username;

// Add the event container app
ReactDOM.render(
    <EventsContainer 
        showGroupName={true}
        active={true}
    />, document.querySelector("#active_events_container")
);