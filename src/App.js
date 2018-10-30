/** timer explained:
 * ongoing -> rest -> onging -> rest -> rest between set -> onoing
 */
import React, { Component } from "react";
import "./App.css";
import TimerDisplay from "./components/countdown_timer";
const REP_DURATION = 4;
const REST_REP_DURATION = 2;
const REST_SET_DURATION = 3;
const REP_PER_SET = 2;
const SET_TOTAL = 1;
const initialState = {
  status: "Click to start",
  seconds: REP_DURATION,
  intervalId: null,
  rep: 0,
  set: 0,
  isBtnStop: false,
  // btnLabel: "Start" /** UIstate, don't put it here */,
  btnClassName: "btn btn-primary mt-3" /** UIstate, don't put it here */
};
/** status refactor */
let banner = initialState.status;
/** button label refactor */
let btnLabel = "Start";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.countDown = this.countDown.bind(this);
    this.stopCountDown = this.stopCountDown.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  onStart() {
    this.countDown();
    this.setState({
      status: "ongoing",
      isBtnStop: true,
      btnClassName: "btn btn-danger mt-3"
    });
    btnLabel = "Stop";
  }

  onStop() {
    this.stopCountDown();
    if (this.state.status === "Finished!") {
      this.setState({
        status: "Click to start",
        seconds: REP_DURATION,
        intervalId: null,
        rep: 0,
        set: 0,
        isBtnStop: false,
        btnClassName: "btn btn-primary mt-3"
      });
      btnLabel = "Restart";
    } else {
      this.setState({
        isBtnStop: false,
        btnClassName: "btn btn-primary mt-3 "
      });
      btnLabel = "Resume";
    }
  }

  countDown() {
    const intervalId = setInterval(
      () => this.setState({ seconds: this.state.seconds - 1 }),
      1000
    );
    this.setState({ intervalId });
  }

  stopCountDown() {
    clearInterval(this.state.intervalId);
    // this.setState({ status: "Click to resume" });
  }

  componentDidUpdate() {
    let { status, seconds, set, rep } = this.state;

    /** check if second===0 */
    if (seconds === 0) {
      switch (status) {
        case "ongoing":
          this.setState({
            status: "resting",
            seconds: REST_REP_DURATION
          });
          break;
        case "resting":
          rep = rep + 1;
          if (rep === REP_PER_SET) {
            /** enough reps for one set */
            set += 1;
            rep = 0;
            if (set === SET_TOTAL) {
              /** enough set, goes to "Finished" */
              this.setState(
                {
                  status: "Finished!",
                  set,
                  rep,
                  btnClassName: "btn btn-primary mt-3",
                  isBtnStop: false
                },
                this.onStop
              );
            } else {
              /** not enough set, goes to "resting between set" */
              this.setState({
                status: "resting between set",
                seconds: REST_SET_DURATION,
                rep,
                set
              });
            }
          } else {
            /** not enough rep for one set, goes to "ongoing" */
            this.setState({
              status: "ongoing",
              seconds: REP_DURATION,
              rep,
              set
            });
          }
          break;
        case "resting between set":
          this.setState({ status: "ongoing", seconds: REP_DURATION });
          break;
        default:
          console.log(`default`);
      }
    }
  }

  renderButton() {
    return (
      <button
        className={this.state.btnClassName}
        style={{ borderRadius: "25px", padding: "11px 40px" }}
        onClick={this.state.isBtnStop === false ? this.onStart : this.onStop}
      >
        {btnLabel}
      </button>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <TimerDisplay
            seconds={this.state.seconds}
            status={this.state.status}
            banner={banner}
          />
          <div>
            rep:
            <span className="label label-primary">{this.state.rep}</span>
          </div>
          <div>set: {this.state.set}</div>
          {this.renderButton()}
        </header>
      </div>
    );
  }
}

export default App;