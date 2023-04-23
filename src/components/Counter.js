import React from "react";
import moment from "moment";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    //need UTC? do moment.unix(startTime).utc()
    this.state = {
      elapsedTime: moment().diff(moment.unix(props.time), 'seconds')
    };
    this.countUp = this.countUp.bind(this);
    setInterval(this.countUp, 1000);
  }

  countUp() {
    this.setState(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }));
  }

  render() {
    return (
      <div>
        <div>{moment.utc(this.state.elapsedTime*1000).format('HH:mm:ss')}</div>
      </div>
    );
  }
}

export default Counter