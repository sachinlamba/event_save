import * as allActions from './allActions';

export function receiveStuff(data) {
    return {type: allActions.RECEIVE_STUFF, stuff: data};
}
export function formattedDate(d) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${year}-${month}-${day}`;
}
export function fetchStuff(startDate, endDate) {
  let sDate = formattedDate(new Date());
  if(startDate && startDate != ""){
    sDate = formattedDate(startDate)
  }
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=ajp0wkSehryzWQo24JvhNAuCF6RX2wyN&startDateTime='+sDate+'T00:00:00Z';
  if(endDate && endDate != ""){
    let eDate = formattedDate(endDate)
    url += '&EndDateTime='+eDate+'T00:00:00Z';
  }
    return (dispatch) => {
        fetch(url)
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
