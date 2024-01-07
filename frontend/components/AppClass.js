// import React from 'react';
// import axios from 'axios';

// const initialMessage = '';
// const initialEmail = '';
// const initialSteps = 0;
// const initialIndex = 4;

// export default class AppClass extends React.Component {
//   state = {
//     message: initialMessage,
//     email: initialEmail,
//     index: initialIndex,
//     steps: initialSteps,
//   };

//   getCoordinates = () => {
//     const x = (this.state.index % 3) + 1;
//     const y = Math.floor(this.state.index / 3) + 1;
//     return `(${x}, ${y})`;
//   };

//   reset = () => {
//     this.setState({
//       message: initialMessage,
//       email: initialEmail,
//       index: initialIndex,
//       steps: initialSteps,
//     });
//   };

//   getNextIndex = (direction) => {
//     const { index } = this.state;
//     switch (direction) {
//       case 'up':
//         return index - 3 >= 0 ? index - 3 : index;
//       case 'down':
//         return index + 3 < 9 ? index + 3 : index;
//       case 'left':
//         return index % 3 !== 0 ? index - 1 : index;
//       case 'right':
//         return index % 3 !== 2 ? index + 1 : index;
//       default:
//         return index;
//     }
//   };

//   move = (direction) => {
//     const newIndex = this.getNextIndex(direction);
//     this.setState({
//       index: newIndex,
//       steps: this.state.steps + 1,
//     });
//   };

//   onChange = (evt) => {
//     const newEmail = evt.target.value;
//     this.setState({ email: newEmail });
//     console.log('New Email:', newEmail);
//   };

//   onSubmit = async (evt) => {
//     evt.preventDefault();
//     const { email } = this.state;

//     // Ensure x and y are integers between 1 and 3, steps is a positive integer
//     const payload = {
//       x: Math.floor(Math.random() * 3) + 1,
//       y: Math.floor(Math.random() * 3) + 1,
//       steps: Math.floor(Math.random() * 10) + 1,
//       email: this.state.email,
//     };

//     try {
//       const response = await axios.post('http://localhost:9000/api/result', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       // Check if the response is successful
//       if (response.data.success) {
//         this.setState({ message: `${response.data.email} win #${response.data.id}` });

//         // Reset the state after a successful submission
//         this.reset();
//       } else {
//         // Handle failure, display the error message from the server
//         this.setState({ message: response.data.message || 'Error submitting the form.' });
//       }
//     } catch (error) {
//       // Handle network errors
//       this.setState({ message: `Network error: ${error.message}` });
//     }
//   };

//   render() {
//     const { className } = this.props;
//     return (
//       <div id="wrapper" className={className}>
//         <div className="info">
//           <h3 id="coordinates">Coordinates {this.getCoordinates()}</h3>
//           <h3 id="steps">You moved {this.state.steps} times</h3>
//         </div>
//         <div id="grid">
//           {Array.from({ length: 9 }, (_, idx) => (
//             <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
//               {idx === this.state.index ? 'B' : null}
//             </div>
//           ))}
//         </div>
//         <div className="info">
//           <h3 id="message">{this.state.message}</h3>
//         </div>
//         <div id="keypad">
//           <button id="left" onClick={() => this.move('left')}>
//             LEFT
//           </button>
//           <button id="up" onClick={() => this.move('up')}>
//             UP
//           </button>
//           <button id="right" onClick={() => this.move('right')}>
//             RIGHT
//           </button>
//           <button id="down" onClick={() => this.move('down')}>
//             DOWN
//           </button>
//           <button id="reset" onClick={this.reset}>
//             reset
//           </button>
//         </div>
//         <form onSubmit={this.onSubmit}>
//           <input id="email" type="email" placeholder="type email" onChange={this.onChange} />
//           <input id="submit" type="submit" />
//         </form>
//       </div>
//     );
//   }
// }
