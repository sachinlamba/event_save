import * as allActions from './allActions';

export function receiveStuff(data) {
    return {type: allActions.RECEIVE_STUFF, stuff: data};
}

export function fetchStuff() {
    return (dispatch) => {
        fetch('https://app.ticketmaster.com/discovery/v2/events.json?apikey=ajp0wkSehryzWQo24JvhNAuCF6RX2wyN&startDateTime=2017-12-04T00:00:00Z')
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                }))
            )
            .then(response => {
                if(response.status === 200){
                    dispatch(receiveStuff(response.data))
                }else{
                    var flash = {
                        type: 'error',
                        title: 'Error getting task list',
                        content: 'There was an error getting the task list. Please try again.'
                    }
                    dispatch({type: "DISPLAY_FLASH", data: flash})
                }
            });
    };
}
