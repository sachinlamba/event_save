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
            start: "",
            end: ""
          }
       }
    }

    componentWillMount() {
        this.props.stuffActions.fetchStuff();
    }

    renderData(item) {
        return <div style={{display:"flex"}} key={item.id}>
                    <div style={{"flex":"1"}}><label>{item.name}</label></div>
                    <div style={{"flex":"1"}}><img width="100px" height="100px" src={item.images[2].url} /> </div>
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
            return (
                <div className="" style={{display:"flex",width:"100%"}}>
                    <div style={{flex:"1"}}>{
                        data.map((item, index) => {
                            return (
                                this.renderData(item)
                            );
                        })
                    }</div>
                    <div style={{flex:"1"}}>
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
                        onDateChange={(d) => this.setState({dates : {start: d.start, end: d.end}})}
                      />
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
