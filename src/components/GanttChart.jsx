import React, { useEffect } from "react";
import { Chart } from "react-google-charts";

function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}

export const GanttChart = (props) => {
  const process = props.data;
  let dataRow = [];
  let startGantt = 0;

  useEffect(() => {
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawChart);

    return () => {
      const container = document.getElementById('example5.5');
      container.innerHTML = '';
    };
  }, [props.data]);

  function drawChart() {
    const container = document.getElementById('example5.5');
    const chart = new google.visualization.Timeline(container);
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Role' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    
    process.forEach((data) => {
    const name = (data.value == 'idle')?'idle': data.value;
      dataRow.push(['Time', name, getDate(startGantt), getDate(data.time)]);
      startGantt = data.time;
    });

    dataTable.addRows([...dataRow]);

    const options = {
      colors: ['#cbb69d', '#603913', '#c69c6e'],
      timeline: {
        showRowLabels: false,
        avoidOverlappingGridLines: false
    }
    };

    

    chart.draw(dataTable, options);
  }

  return <div id="example5.5" style={{ height: '150px' }}></div>;
};
