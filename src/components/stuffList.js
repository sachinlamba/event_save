import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../actions/stuffActions';
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
          dates: {
            start: new Date(2018, 3, 10),
            end: new Date(2018, 3, 15)
          }
       }
       this.filterByDate = this.filterByDate.bind(this);
    }

    componentWillMount() {
        this.props.stuffActions.fetchStuff();
    }
    filterByDate(){
      this.props.stuffActions.fetchStuff(this.state.dates.start, this.state.dates.end);
    }

    renderData(item) {
        return <div style={{display:"flex", border: "2px solid #5d5df194",borderBottom: "none"}} key={item.id}>
                    <div style={{flex: "1", marginTop: "40px"}}>
                      <label style={{padding: "43px"}}>{item.name}</label>
                      </div>
                    <div style={{borderLeft: "2px solid #5d5df194"}}>
                      <img style={{padding: "2px", "cursor":"pointer"}} onClick={() => window.open(item.url, '_target')}
                        width="100px" height="100px" src={item.images[2].url} />
                    </div>
                </div>;
    }

    render() {
        if(!this.props.stuff){
            return (
                <div>
                    Loading Stuff...
                </div>
            )
        }else{
          let data = this.props.stuff._embedded ? this.props.stuff._embedded.events : [];
          let height = window.innerHeight - 50,
              width = window.innerWidth/2 - 20;
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
                    <div style={{//flex:"1",
                    height: "96%", overflow: "hidden",}}>
                      <InfiniteCalendar
                        Component={CalendarWithRange}
                        selected={this.state.dates}
                        // {{
                        //   start: new Date(2017, 1, 10),
                        //   end: new Date(2017, 1, 18),
                        // }}
                        locale={{
                          headerFormat: 'MMM Do',
                        }}
                        onSelect={(d) => {this.setState({dates : {start: d.start, end: d.end}}); }}
                      />
                  </div>
                </div>

                <div style={{
                        height: "25px", color: "white",maxWidth: "100px",
                        backgroundColor: "deepskyblue",paddingTop: "5px",
                        textAlign: "center",marginLeft: width,"cursor":"pointer"
                      }}
                      onClick={this.filterByDate}>Filter events
                </div>
              </div>
            )
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
