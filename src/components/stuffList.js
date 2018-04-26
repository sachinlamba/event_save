import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../actions/stuffActions';
import '../styles/stuff.css';
import PropTypes from 'prop-types';
import React from 'react';
import {render} from 'react-dom';
import InfiniteCalendar, {
  Calendar,
  withRange,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
const CalendarWithRange = withRange(Calendar);

class stuffList extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          pages: ["start", "viewEvent", "newEvent", "save"],
          pageLevel: 0,
          savedEvents: [],
          dates: {
            start: new Date(2018, 3, 30),
            end: new Date(2018, 4, 2)
          }
       }
       this.filterByDate = this.filterByDate.bind(this);
       this.moveToNextPage = this.moveToNextPage.bind(this);
       this.moveToPreviousPage = this.moveToPreviousPage.bind(this);
    }
    moveToNextPage(){
      this.setState({pageLevel: this.state.pageLevel+1});
    }
    moveToPreviousPage(){
      this.setState({pageLevel: this.state.pageLevel-1});
    }
    componentWillMount() {
        this.props.stuffActions.fetchStuff(this.state.dates.start, this.state.dates.end);
    }
    filterByDate(){
      this.props.stuffActions.fetchStuff(this.state.dates.start, this.state.dates.end);
    }
    addToEvents(event){
      let add = this.state.savedEvents;
      add.push(event.id);
      this.setState({savedEvents: add})
    }
    removeFromEvents(event){

    }

    renderData(item) {
      let sDate = new Date(item.sales.public.startDateTime),
          eDate = new Date(item.sales.public.endDateTime),
          todayDate = new Date();
      // let displaysDate = sDate.getFullYear() + "-" + sDate.getMonth() + "-" + sDate.getDate(),
      //     displayeDate = eDate.getFullYear() + "-" + eDate.getMonth() + "-" + eDate.getDate();
      let left = window.innerWidth/3;
      let buttonBuy;
        if(sDate > todayDate){
          buttonBuy = "sales-not-start";
        }else if(eDate > todayDate){
          buttonBuy = "sales-start";
        }else{
          buttonBuy = "sales-end";
        }
        return <div className="events-box" key={item.id}>
                    <div className="event-details">
                      <div className="event-name">
                        <label style={{padding: "43px"}}>{item.name}</label>
                      </div>
                      <div className="button-space">
                        <div className={"button " + buttonBuy} onClick={() => window.open(item.url, '_target')}>Buy</div>
                        {this.state.savedEvents.indexOf(item.id) > -1 ?
                          <div className="button" onClick={this.removeFromEvents.bind(this, item)}>Remove</div>
                        :
                          <div className="button event-adder" onClick={this.addToEvents.bind(this, item)}>Save</div>
                        }
                      </div>
                      <div className="event-image">
                        <img className="event-small-image" alt={item.name} src={item.images[2].url} />
                      </div>
                    </div>
                    <div className="event-venue" style={{marginLeft: left}}>Venue :
                              <label onClick={()=>window.open(item._embedded.venues[0].url, '_target')}
                                 className="event-address">{"  " + item._embedded.venues[0].name}</label>
                                                    </div>
                                                    {/* {item._embedded.venues[0].address.line1 + " > " +
                                                    item._embedded.venues[0].city.name + " > " +
                                                    item._embedded.venues[0].state.name + " > " +
                                                    item._embedded.venues[0].country.countryCode} */}
                    {/* <div style={{position: "absolute"}}>Tickets publically available from {displaysDate} to {displayeDate}</div> */}
                </div>;
    }

    render() {
        if(!this.props.stuff){
            return (
                <div style={{marginTop: "18%", marginLeft: "50%"}}>
                    Loading Stuff...
                </div>
            )
        }else{
          let data = this.props.stuff._embedded ? this.props.stuff._embedded.events : [];
          let height = window.innerHeight - 50,
              width = window.innerWidth/2 - 20,
             width1 = window.innerWidth/3
          if(this.state.pageLevel === 0){
            return <div>
                        <div>Start</div>
                        <div style={{marginLeft: width}} className="filter-button" onClick={this.moveToNextPage}>
                          Want to go with Family or Friends
                        </div>
                    </div>

          }else if(this.state.pageLevel === 1){
            return (
              <div>
                <div className="" style={{display:"flex",width:"100%",  height }}>
                    <div style={{flex:"1", height: "96%", overflow: "auto", margin: "5px"}}>{
                        data.map((item, index) => {
                            return (
                                this.renderData(item)
                            );
                        })
                    }</div>
                    <div style={{height: "96%", overflow: "hidden",}}>
                      <InfiniteCalendar
                        Component={CalendarWithRange}
                        selected={this.state.dates}
                        locale={{
                          headerFormat: 'MMM Do',
                        }}
                        onSelect={(d) => {this.setState({dates : {start: d.start, end: d.end}}); }}
                      />
                  </div>
                </div>
                <div style={{display: "inline-block"}} className="filter-button" onClick={this.moveToPreviousPage}>Previous Page</div>
                <div style={{marginLeft: width1, display: "inline-block"}} className="filter-button" onClick={this.filterByDate}>Filter events</div>
              </div>
            )
          }
        }
    }
}

stuffList.propTypes = {
    stuffActions: PropTypes.object,
    stuff: PropTypes.array
};

function mapStateToProps(state) {
    return {
        stuff: state.stuff
    };
}

function mapDispatchToProps(dispatch) {
    return {
       stuffActions: bindActionCreators(stuffActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(stuffList);
