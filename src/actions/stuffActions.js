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
export function fetchStuff(state) {
  let sDate = formattedDate(new Date());
  if(state.dates && state.dates.start != ""){
    sDate = formattedDate(state.dates.start)
  }
  let includeFamily;
  switch (state.includeFamily) {
    case "0":
      includeFamily = "no";
      break;
    case "1":
      includeFamily = "only";
      break;
    case "2":
      includeFamily = "no";
      break;
    case "3":
      includeFamily = "yes";
      break;
    default:
      includeFamily = "no";
  }
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=ajp0wkSehryzWQo24JvhNAuCF6RX2wyN&startDateTime='+sDate
      +'T00:00:00Z&includeFamily='+includeFamily;
  if(state.dates && state.dates.end != ""){
    let eDate = formattedDate(state.dates.end)
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
