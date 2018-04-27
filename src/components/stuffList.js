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
          includeFamily: "1",
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
      //as asyn state is updating,so we use 0 page no here..would have used 1 actually..
      if(this.state.pageLevel == 0){
        this.props.stuffActions.fetchStuff(this.state);
      }
    }
    moveToPreviousPage(){
      this.setState({pageLevel: this.state.pageLevel-1});
    }
    // componentWillMount() {
    //     this.props.stuffActions.fetchStuff(this.state.dates.start, this.state.dates.end);
    // }
    filterByDate(){
      this.props.stuffActions.fetchStuff(this.state);
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
                      {
                        item._embedded ?
                          <label onClick={()=>window.open(item._embedded.venues[0].url, '_target')}
                             className="event-address">{"  " + item._embedded.venues[0].name}</label>
                          :
                          <label className="event-address">{"  " + item.place[0].address}</label>
                      }
                      </div>
                    {/* {item._embedded.venues[0].address.line1 + " > " +
                    item._embedded.venues[0].city.name + " > " +
                    item._embedded.venues[0].state.name + " > " +
                    item._embedded.venues[0].country.countryCode} */}
                    {/* <div style={{position: "absolute"}}>Tickets publically available from {displaysDate} to {displayeDate}</div> */}
                </div>;
    }
    familyOptionChange(changeEvent) {
      this.setState({
        includeFamily: changeEvent.target.value
      });
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
             width1 = window.innerWidth/3,
             width2 = window.innerWidth - 120;
             let pageDiv = [];
          if(this.state.pageLevel === 0){
            pageDiv.push(<div>
                            <div>Plan your day</div>
                            <div>Who are you?</div>
                            <div className="radio">
                              <label>
                                <input type="radio" value="0" checked={this.state.includeFamily == "0"}
                                  onChange={this.familyOptionChange.bind(this)}
                                />
                                Friends
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input type="radio" value="1" checked={this.state.includeFamily == "1"}
                                  onChange={this.familyOptionChange.bind(this)}
                                />
                                Family
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input type="radio" value="2" checked={this.state.includeFamily == "2"}
                                  onChange={this.familyOptionChange.bind(this)}
                                />
                                Single
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input type="radio" value="3" checked={this.state.includeFamily == "3"}
                                  onChange={this.familyOptionChange.bind(this)}
                                />
                                Couple
                              </label>
                            </div>
                        </div>)

          }else if(this.state.pageLevel === 1){
            pageDiv.push(
              <div>
                <div className="" style={{display:"flex",width:"100%",  height }}>
                    <div style={{flex:"1", height: "96%", overflow: "auto", margin: "5px"}}>{
                        data.length ? data.map((item, index) => {
                            return (
                                this.renderData(item)
                            );
                        })
                        :
                        <div>No Data available right now</div>
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
                <div style={{left: width, position: "absolute"}} className="button filter-button" onClick={this.filterByDate}>Filter events</div>
              </div>
            )
          }else if(this.state.pageLevel === 2){
            pageDiv.push(<div>
                        <div>want to mail saved event calender?</div>
                        </div>)

          }
          if(this.state.pageLevel != 0){
            pageDiv.push(<div style={{position: "absolute", left: "22px", bottom: "10px"}} className="button filter-button" onClick={this.moveToPreviousPage}>Previous Page</div>);
          }
          if(this.state.pageLevel < this.state.pages.length-1){
            pageDiv.push(<div style={{position: "absolute", right: "22px", bottom: "10px"}} className="button filter-button" onClick={this.moveToNextPage}>Next Page</div>)
          }
          return pageDiv;
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
