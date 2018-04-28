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
// import * as ICS from 'ics-js';
import AddToCalendar from 'react-add-to-calendar';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

//import '../styles/atc-style-glow-orange.css';
const CalendarWithRange = withRange(Calendar);

class stuffList extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          pages: ["start", "viewEvent", "newEvent"],
          pageLevel: 0,
          includeFamily: "0",
          savedEvents: {},
          dates: {
            start: new Date(2018, 3, 30),
            end: new Date(2018, 4, 2)
          },
          calenderOpen: false,
          selectedItem: 0,
          filePreparred: false
          // ,event: [{
          //           title: 'Sample Event',
          //           description: 'This is the sample event provided as an example only',
          //           location: 'Portland, OR',
          //           startTime: '2016-09-16T20:15:00-04:00',
          //           endTime: '2016-09-16T21:45:00-04:00'
          //         },{
          //           title: 'Sample Event',
          //           description: 'This is the sample event provided as an example only',
          //           location: 'Portland, OR',
          //           startTime: '2016-09-16T20:15:00-04:00',
          //           endTime: '2016-09-16T21:45:00-04:00'
          //         }]
       }
       this.filterByDate = this.filterByDate.bind(this);
       this.moveToNextPage = this.moveToNextPage.bind(this);
       this.moveToPreviousPage = this.moveToPreviousPage.bind(this);
       this.calenderCloser = this.calenderCloser.bind(this);
       this.calenderOpener = this.calenderOpener.bind(this);
       this.carouselItemChange = this.carouselItemChange.bind(this);
       this.createEventFile = this.createEventFile.bind(this);
    }
    carouselItemChange(itemSelected){
      this.setState({
        selectedItem: itemSelected
      })
    }
    calenderOpener(){
      this.setState({
        calenderOpen: true
      })
      document.addEventListener("click", this.calenderCloser)
    }
    calenderCloser(event){
      if(!document.getElementsByClassName('Cal__Container__root')[0].contains(event.target)){
        this.setState({
          calenderOpen: false
        })
        document.removeEventListener("click", this.calenderCloser)

      }
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
      add[event.id] = event;
      this.setState({savedEvents: add})
    }
    removeFromEvents(event){
      let add = this.state.savedEvents;
      delete add[event.id];
      this.setState({savedEvents: add})
    }
    createEventFile(){
      let icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\n"
      Object.keys(this.state.savedEvents).map(eventId => {
        let item = this.state.savedEvents[eventId];
        console.log("icsMSG" ,item);
        icsMSG += "BEGIN:VEVENT\nUID:me@google.com\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\nORGANIZER;CN=Me:MAILTO::me@gmail.com\nDTSTART:" +"20120315T170000Z" +"\nDTEND:" + "20120315T170000Z"+"\nLOCATION:" + "India"+ "\nSUMMARY:Our Meeting Office\nEND:VEVENT\n"
      })
      icsMSG += "END:VCALENDAR";
      console.log("icsMSG11", icsMSG);
      var a = document.getElementById("a");
      var file = new Blob([icsMSG], {type: "text/plain"});
      a.href = URL.createObjectURL(file);
      a.download = "down.ics";
      this.setState({filePreparred: true});
      // window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
      // var cal = ics();
      // cal.addEvent("check", "ehloo", "India", new Date(), new Date());
      // cal.addEvent("subject", "description", "location",  new Date(), new Date()); // yes, you can have multiple events :-)
      // cal.download("Events");
      // const cal = new ICS.VCALENDAR();
      // cal.addProp('VERSION', 2) // Number(2) is converted to '2.0'
      // cal.addProp('PRODID', 'XYZ Corp');
      // const event = new ICS.VEVENT();
      // event.addProp('UID');
      // event.addProp('DTSTAMP', new Date(), { VALUE: 'DATE-TIME' });
      // event.addProp('ATTENDEE', null, {
      //   CN: 'Happd BDAY',
      //   RSVP: 'FALSE:mailto:foo@example.com'
      // })
      //
      // cal.addComponent(event);
      // var icsMSG = cal.toString();
      // window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
    }

        renderTable(item) {
          let sDate = new Date(item.sales.public.startDateTime),
              eDate = new Date(item.sales.public.endDateTime),
              todayDate = new Date();
          let displaysDate = sDate.getFullYear() + "-" + sDate.getMonth() + "-" + sDate.getDate(),
              displayeDate = eDate.getFullYear() + "-" + eDate.getMonth() + "-" + eDate.getDate();
          let left = window.innerWidth/3;
          let buttonBuy;
            if(sDate > todayDate){
              buttonBuy = "sales-not-start";
            }else if(eDate > todayDate){
              buttonBuy = "sales-start";
            }else{
              buttonBuy = "sales-end";
            }
            let event = {
              title: item.name,
              description: item.info,
              location: item._embedded ? item._embedded.venues[0].name : item.place[0].address,
              startTime: item.sales.public.startDateTime,
              endTime: item.sales.public.startDateTime
            };
            return <div className="events-box" key={item.id}>
              <div className="event-image col-md-2">
                <img className="img-circle img-responsive " alt={item.name} src={item.images[2].url} />
              </div>

                        <div className="event-details" style={{padding: "10px"}}>
                          <div className="event-name">
                           <h4 style={{color:"#f7786b"}}>Event Information:</h4>
                            <label style={{fontSize:"20px"}}>{item.name}</label>

                            <div className="event-venue">

                               <h4 style={{color:"#f7786b", display: "inline-block"}}>Venue:</h4>
                              {
                                item._embedded ?
                                  <label onClick={()=>window.open(item._embedded.venues[0].url, '_target')}
                                     className="event-address">{"  " + item._embedded.venues[0].name}</label>
                                  :
                                  <label className="event-address">{"  " + item.place[0].address}</label>
                              }
                              </div>

                              <div className="event-dates">Tickets publically available from {displaysDate} to {displayeDate}</div>

                          </div>




                          <div className="button-space">
                            <div className={"btn " + buttonBuy} onClick={() => window.open(item.url, '_target')}>Buy</div>
                            {this.state.savedEvents[item.id] ?
                              <div className="btn" onClick={this.removeFromEvents.bind(this, item)}>Remove</div>
                            :
                              <div className="btn btn-info event-adder" style={{marginTop:"10px",marginBottom:"5px"}}onClick={this.addToEvents.bind(this, item)}>Save to list</div>
                            }
                            <AddToCalendar event={event}/>
                          </div>

                        </div>




                        {/* {item._embedded.venues[0].address.line1 + " > " +
                        item._embedded.venues[0].city.name + " > " +
                        item._embedded.venues[0].state.name + " > " +
                        item._embedded.venues[0].country.countryCode} */}
                    </div>;
        }

    renderData(item) {
      let sDate = new Date(item.sales.public.startDateTime),
          eDate = new Date(item.sales.public.endDateTime),
          todayDate = new Date();
      let displaysDate = sDate.getFullYear() + "-" + sDate.getMonth() + "-" + sDate.getDate(),
          displayeDate = eDate.getFullYear() + "-" + eDate.getMonth() + "-" + eDate.getDate();
      let left = window.innerWidth/3;
      let buttonBuy;
        if(sDate > todayDate){
          buttonBuy = "sales-not-start";
        }else if(eDate > todayDate){
          buttonBuy = "sales-start";
        }else{
          buttonBuy = "sales-end";
        }
        let event = {
          title: item.name,
          description: item.info,
          location: item._embedded ? item._embedded.venues[0].name : item.place[0].address,
          startTime: item.sales.public.startDateTime,
          endTime: item.sales.public.startDateTime
        };
        return <div>
                  <img src={item.images[2].url} />
                  <p className="legend">{item.name}</p>
              </div>
    }
    familyOptionChange(value) {
      this.setState({
        includeFamily: value
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
          let height = window.innerHeight - 100,
            fullHeight = window.innerHeight,
            fullWidth = window.innerWidth - 20,
            width = window.innerWidth/2 - 20,
             width1 = window.innerWidth/3,
             width2 = window.innerWidth - 120;
             let pageDiv = [];

          if(this.state.pageLevel === 0){
            pageDiv.push(<div className="container" style={{textAlign:"center", height: fullHeight, width: fullWidth}}>


                        <div className="col-md-8 col-md-offset-2" style={{backgroundColor:"#f9f9f9",padding:"10px",marginTop:"20px",paddingBottom:"40px"}}>
                        <h2 className="text-info">Plan your day!</h2>
                        <h4 className="text-success" style={{marginTop:"5px"}}>Who are you?</h4>
                        <div class="row">
                          <div class="who-image col-xs-6 col-md-4" style={{cursor: "pointer"}} onClick={this.familyOptionChange.bind(this, "0")} >
                              <img style={{border: (this.state.includeFamily =="0" ? "1px solid green" : "") }}  class="image img-circle"  src="friends.png" />
                              <div class="middle">
                                <div class="text">Friends</div>
                              </div>
                          </div>
                          <div class="who-image col-xs-6 col-md-4" style={{cursor: "pointer"}} onClick={this.familyOptionChange.bind(this, "1")}>
                              <img  style={{border: (this.state.includeFamily =="1" ? "1px solid green" : "") }} class="image img-circle"  src="family.png"  />
                              <div class="middle">
                                <div class="text">Family</div>
                              </div>
                          </div>
                          <div class="who-image col-xs-6 col-md-4" style={{cursor: "pointer"}} onClick={this.familyOptionChange.bind(this, "2")}>
                              <img  style={{border: (this.state.includeFamily =="2" ? "1px solid green" : "") }} class="image img-circle"   src="single.png"  />
                              <div class="middle">
                                <div class="text">Single</div>
                              </div>
                          </div>
                          <div class="who-image col-xs-6 col-md-4" style={{cursor: "pointer"}} onClick={this.familyOptionChange.bind(this, "3")}>
                              <img  style={{border: (this.state.includeFamily =="3" ? "1px solid green" : "") }} class="image img-circle"  src="couple.png"  />
                              <div class="middle">
                                <div class="text">Couple</div>
                              </div>
                        </div>
                      </div>
                            </div>
                        </div>)

          }else if(this.state.pageLevel === 1){
            pageDiv.push(
              <div style={{textAlign:"center", height: fullHeight, width: fullWidth, padding: "26px"}}>
                <div>
                <div>
                {
                data.length ? <Carousel showArrows={true} selectedItem={this.state.selectedItem} onChange={this.carouselItemChange}>{data.map((item, index) => {
                  let event = {
                    title: item.name,
                    description: item.info,
                    location: item._embedded ? item._embedded.venues[0].name : item.place[0].address,
                    startTime: item.sales.public.startDateTime,
                    endTime: item.sales.public.startDateTime
                  };
                        return (
                          <div>
                              <img src={item.images[2].url}/>
                              <p className="legend">{item.name}

                              <div style={{display: "inline", marginLeft: "15px"}}>
                                <div style={{margin: "0px 15px"}} className="btn btn-primary" onClick={() => window.open(item.url, '_target')}>Buy</div>
                                {this.state.savedEvents[item.id] ?
                                  <div style={{margin: "0px 15px"}} className="btn btn-primary" onClick={this.removeFromEvents.bind(this, item)}>Remove</div>
                                :
                                  <div style={{margin: "0px 15px"}} className="btn btn-info "onClick={this.addToEvents.bind(this, item)}>Save to list</div>
                                }
                                <div style={{margin: "0px 15px", display: "inline"}} >
                                <AddToCalendar event={event}/>
                                </div>
                              </div>

                              </p>
                          </div>
                        );
                    })
                  }</Carousel>
                  :
                  <div class="loader"></div>
                //   <Carousel showArrows={true}>
                //     <div>
                //       <img src="https://giphy.com/gifs/google-icon-loading-jAYUbVXgESSti" />
                //       <p className="legend">Loading ...</p>
                //     </div>
                // </Carousel>
                }
                </div>
                    {
                    //   <div style={{flex:"1", height: "96%", overflow: "auto", margin: "5px"}}>{
                    //     data.length ? data.map((item, index) => {
                    //         return (
                    //             this.renderData(item)
                    //         );
                    //     })
                    //     :
                    //     <div>No Data available right now</div>
                    // }
                    // </div>
                  }
                  <div className="btn btn-warning" style={{position: "absolute", top: "0px", left: "0px"}} onClick={this.calenderOpener}>Show Calender </div>
                { this.state.calenderOpen &&
                     <div className="calender-adder" style={{ height: "96%", overflow: "hidden",position: "absolute", top: "20px"}}>
                     <div style={{opacity: "0.3",    backgroundColor: "black", top: "0px", left: "0px", position: "fixed",  backgroundCcolor: "black",opacity: "0.5", width: fullWidth, height: fullHeight}}></div>
                      <InfiniteCalendar
                        Component={CalendarWithRange}
                        selected={this.state.dates}
                        locale={{
                          headerFormat: 'MMM Do',
                        }}
                        onSelect={(d) => {this.setState({dates : {start: d.start, end: d.end}}); }}
                      />
                  </div>
                }
                </div>
                <div style={{left: width, position: "absolute", bottom: "10px"}} className="btn btn-primary" onClick={this.filterByDate}>Filter events</div>
              </div>
            )
          }
          else if(this.state.pageLevel === 2){
            pageDiv.push(<div style={{textAlign:"center", height: fullHeight, width: fullWidth, padding: "26px"}}>
                        <div style={{textAlign: "center"}}><h2>want to mail saved event calender?</h2></div>
                        <div style={{flex:"1", height: height, overflow: "auto", margin: "5px"}}>{
                            Object.keys(this.state.savedEvents).length ? Object.keys(this.state.savedEvents).map((item, index) => {
                                return (
                                    this.renderTable(this.state.savedEvents[item])
                                );
                            })
                            :
                            <div>No Data available right now</div>
                        }</div>
                        <div style={{left: width1, position: "absolute", bottom: "10px", width: "150px"}} className={"btn btn-primary "  + (!this.state.filePreparred ? "" : "disabled")} onClick={this.createEventFile.bind(this)}>Prepare Event file</div>

                          <div style={{left: width, position: "absolute", bottom: "10px", width: "150px"}} className={"btn btn-primary " + (this.state.filePreparred ? "" : "disabled")}><a style={{color: "white"}} href="" id="a">Import Events</a></div>

                        </div>)
          }
          if(this.state.pageLevel != 0){
            pageDiv.push(<div style={{position: "absolute", left: "22px", bottom: "10px"}} className="btn btn-primary" onClick={this.moveToPreviousPage}>Previous Page</div>);
          }
          if(this.state.pageLevel < this.state.pages.length-1){
            pageDiv.push(<div style={{position: "absolute", right: "22px", bottom: "10px"}} className="btn btn-primary" onClick={this.moveToNextPage}>Next Page</div>)
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
