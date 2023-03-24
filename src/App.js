import logo from './logo.svg';
import './App.css';
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { useState } from 'react';


function App() {
  const [head, setHead] = useState();
  const [request, setRequest] = useState("");
  const [requests, setRequests] = useState([]);
  const [totalHeadMovement, setTotalHeadMovement] = useState(0);
  const [seekOperations, setSeekOperations] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Head Movement",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequests([...requests, parseInt(request)]);
    setRequest("");
  };

  const handleHeadSubmit = (e) => {
    e.preventDefault();
    setHead(parseInt(head));
    setHead("");

  }

  const handleSSTF = () => {
    let currentHead = head;
    let pendingRequests = [...requests];
    let headMovement = 0;
    let seekOps = [head];

    while (pendingRequests.length > 0) {
      let nearestRequestIndex = 0;
      let nearestRequestDistance = Math.abs(pendingRequests[0] - currentHead);

      for (let i = 1; i < pendingRequests.length; i++) {
        const distance = Math.abs(pendingRequests[i] - currentHead);
        if (distance < nearestRequestDistance) {
          nearestRequestIndex = i;
          nearestRequestDistance = distance;
        }
      }

      headMovement += nearestRequestDistance;
      currentHead = pendingRequests[nearestRequestIndex];
      seekOps.push(currentHead);
      pendingRequests.splice(nearestRequestIndex, 1);
    }

    setTotalHeadMovement(headMovement);
    setSeekOperations(seekOps);

    // Create a new chart data object with the seek operations data
    const newData = {
      labels: seekOps.map((_, index) => index),
      datasets: [
        {
          label: "Head Movement",
          data: seekOps,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    };

    setChartData(newData);


  };

  return (
    <div
    //bg of will be violet

    >
      <h2
        className='text-center  text-4xl font-bold'
      >SSTF Disk Scheduling Algorithm</h2>
      <form onSubmit={handleRequestSubmit}
        className='text-center  text-2xl font-bold mt-16'
      >

        <label
          className='flex flex-col justify-center'
        >
          Enter a new request:
          <input
            className='bg-gray-200 text-black font-bold py-2 px-4 rounded'
            type="number"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
          <button type="submit"
            className='bg-blue-500 ml-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >Add</button>
        </label>




      </form>
      <form onSubmit={handleHeadSubmit}
        className='text-center  text-2xl font-bold mt-16'
      >
        <label
          className='flex flex-col justify-center'
        >
          Enter the initial head position:
          <input
            className='bg-gray-200 text-black font-bold py-2 px-4 rounded'
            type="number"
            value={head}
            onChange={(e) => setHead(e.target.value)}
          />
          <button
            className='bg-blue-500 ml-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            type="submit"
          >
            Add Head
          </button>
        </label>


      </form>
      <br />
      <div
        className="flex justify-center items-center"
      >

        <button onClick={handleSSTF}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >Run SSTF Algorithm</button>
      </div>

      <br />
      <br />
      <div>
        <p>Head: {head}</p>
        <p>Requests: {requests.join(", ")}</p>
        <p>Total Head Movement: {totalHeadMovement}</p>
      </div>
      <div>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
