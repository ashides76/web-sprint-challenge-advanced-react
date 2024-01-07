import React, {useState} from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const gridSize = 3;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);


  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    return { x: x + 1, y: y + 1 };
  }

  function getXYMessage(index) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY(index);
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrentIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage)
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const x = currentIndex % gridSize;
    const y = Math.floor(currentIndex / gridSize);

    switch (direction) {
      case 'left':
        return x > 0 ? currentIndex - 1 : currentIndex;
      case 'up':
        return y > 0 ? currentIndex - gridSize : currentIndex;
      case 'right':
        return x < gridSize - 1 ? currentIndex + 1 : currentIndex;
      case 'down':
        return y < gridSize - 1 ? currentIndex + gridSize : currentIndex;
      default:
        return currentIndex;
    }
  }

  function move(direction) {
    const nextIndex = getNextIndex(direction);
    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      setSteps(steps + 1);
      setMessage(getXYMessage(nextIndex));
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();
  
    if (!email) {
      setMessage("Ouch: email is required");
      return;
    }
  
    const { x, y } = getXY(currentIndex);
  
    const payload = {
      x,
      y,
      steps,
      email,
    };
  
    try {
      const response = await axios.post('http://localhost:9000/api/result', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        setMessage(`Server error: ${response.statusText}`);
        return;
      }
  
      const result = response.data;
  
      if (result) {
        setMessage(result.message);
        setEmail(initialEmail)
      } 
    } catch (error) {
      setMessage('Error submitting the form.');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(currentIndex)}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [...Array(gridSize * gridSize).keys()].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => move('left')} id="left">LEFT</button>
        <button onClick={() => move('up')} id="up">UP</button>
        <button onClick={() => move('right')} id="right">RIGHT</button>
        <button onClick={() => move('down')} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
