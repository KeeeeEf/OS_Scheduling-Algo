import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/App.css';

function Home() {
  const algos = [
    'First Come First Serve',
    'Round-Robin Scheduling',
    'Shortest Job First',
    'Shortest Remaining Time First',
    'Priority Non-Preemptive',
    'Multilevel Queue',
    'Priority-Based Scheduling',
    'Multilevel Feedback Queue',
  ];
  const navigate = useNavigate();

  const handleNavigate = (algorithm) => {
    sessionStorage.setItem('selectedAlgorithm', algorithm);

    switch (algorithm) {
      case 'First Come First Serve':
      navigate('/input');
      break;
    case 'Round-Robin Scheduling':
      navigate('/rr-input');
      break;
    case 'Shortest Job First':
      navigate('/input');
      break;
    case 'Shortest Remaining Time First':
      navigate('/input');
      break;
    case 'Priority Non-Preemptive':
      navigate('/priority-input');
      break;
    case 'Multilevel Queue':
      navigate('/input'); // TO BE CHANGED
      break;
    case 'Priority-Based Scheduling':
      navigate('/priority-input');
      break;
    case 'Multilevel Feedback Queue':
      navigate('/input'); // TO BE CHANGED
      break;
    default:
      navigate('/input');
    }
  };

  const displayButtons = (datum, index) => {
    return (
      <>
        <div className="col-md-6">
          <button
            type="button"
            onClick={() => handleNavigate(datum)}
            className="w-100 m-1 btn btn-danger btn-block"
          >
            {datum}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="bg-primary">
      <h1>CPU Scheduling Simulator</h1>
      <div>
        <h2 className="text-start">Choose an Algorithm</h2>

        <div className="container" style={{ maxWidth: '970px' }}>
          <div className="row">
            {algos.map((data, index) => {
              return displayButtons(data, index);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
