import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const algoAcronyms = {
    'First Come First Serve': 'FCFS',
    'Round-Robin Scheduling': 'RR',
    'Shortest Job First': 'SJF',
    'Shortest Remaining Time First': 'SRTF',
    'Priority Non-Preemptive': 'PNP',
    'Multilevel Queue': 'MLQ',
    'Priority-Based Scheduling': 'PB',
    'Multilevel Feedback Queue': 'MLFQ',
  };

  const navigate = useNavigate();

  const handleNavigate = (algorithm) => {
    const algorithmAcronym = algoAcronyms[algorithm];
    sessionStorage.setItem('selectedAlgorithm', algorithmAcronym);

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

  const displayButtons = (datum) => {
    return (
      <>
        <div className="col-md-6">
          <button
            type="button"
            onClick={() => handleNavigate(datum)}
            className="w-100 m-1 mt-3 btn btn-lg btn-danger btn-block"
          >
            {datum}
          </button>
        </div>
      </>
    );
  };

  return (
    <div>
      <h1>CPU Scheduling Simulator</h1>
      <h4>By Gallego & Garcia</h4>
      <div className='m-5'>
        <h3 className="text-start">Choose an Algorithm:</h3>

        <div className="container" style={{ maxWidth: '950px' }}>
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
