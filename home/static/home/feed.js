// Get username
const username = document.querySelector("#data-items").dataset.username;

// Add the event container app
/**GroupId is not needed because for user's feed, I load the events based on user's request
 * And I am not loading from just one group, events from multiple groups will be loaded
 * Member flag is also not needed for the same reason
 */
ReactDOM.render(
    <EventsContainer 
        showGroupName={true}
        active={true}
    />, document.querySelector("#active_events_container")
);