var barCount = 120;
//var initialDateStr = new Date().toUTCString();

var data_id = document.getElementById('data_date').value
var [year, month, day, hour, minute] = data_id.split("-").map(Number);
var dateObj = new Date(year, month - 1, day, hour, minute);
var initialDateStr = dateObj.toUTCString();

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

var barData = new Array(barCount);
var lineData = new Array(barCount);

getInitData(initialDateStr);

candlestick_chart = {
      label: 'Bitcoin chart',
      type: 'candlestick',
      data: barData
    }

line_chart = {
      label: 'Bitcoin chart',
      type: 'line',
      data: lineData
    }

var chart = new Chart(ctx, {
  type: "candlestick",
  data: {
    datasets: [candlestick_chart]
  }
});
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function initBar(target, index, date) {

  if (!target[index]) {
    target[index] = {};
  }

  Object.assign(target[index], {
    x: date.valueOf(),
    o: 0,
    h: 0,
    l: 0,
    c: 0
  });

}

function getInitData(dateStr) {
  var date = luxon.DateTime.fromRFC2822(dateStr);

  for (let i = 0; i < barData.length;) {
    initBar(barData, i, date);
    lineData[i] = {x: barData[i].x, y: barData[i].c};
    date = date.plus({minute: 1});
    i++;
  }
}

function updateData(data, dateStr) {
  var date = luxon.DateTime.fromRFC2822(dateStr);

  for (let i = 0; i < barData.length;) {
    if (!barData[i]) {
      barData[i] = {};
    }
    Object.assign(barData[i], {
      x: date.valueOf(),
      o: data["o"][i],
      h: data["h"][i],
      l: data["l"][i],
      c: data["c"][i]
    });
    lineData[i] = {x: barData[i].x, y: barData[i].c};
    date = date.plus({minute: 1});
    i++;
  }
}
var update = function() {
  var dataset = chart.config.data.datasets[0];

  // candlestick vs ohlc
  var type = document.getElementById('type').value;
  if (type != chart.config.type) {
    if (type == "continuous") {
      chart.data.datasets[0] = line_chart
    }
    else if (type == "candlestick") {
      chart.data.datasets[0] = candlestick_chart
    }
  }

  chart.config.type = type;

  // linear vs log
  var scaleType = document.getElementById('scale-type').value;
  chart.config.options.scales.y.type = scaleType;

  // color
  var colorScheme = document.getElementById('color-scheme').value;
  if (colorScheme === 'neon') {
    chart.config.data.datasets[0].backgroundColors = {
      up: '#01ff01',
      down: '#fe0000',
      unchanged: '#999',
    };
  } else {
    delete chart.config.data.datasets[0].backgroundColors;
  }

  // border
  var border = document.getElementById('border').value;
  if (border === 'false') {
    dataset.borderColors = 'rgba(0, 0, 0, 0)';
  } else {
    delete dataset.borderColors;
  }

  chart.update();
};
update();
[...document.getElementsByTagName('select')].forEach(element => element.addEventListener('change', update));

document.getElementById('loadData').addEventListener('click',async function() {
  const data = await loadData();
  var data_id = document.getElementById('data_date').value
  var [year, month, day, hour, minute] = data_id.split("-").map(Number);
  var dateObj = new Date(year, month - 1, day, hour, minute);
  var DateStr = dateObj.toUTCString();
  updateData(data, DateStr);
  update();
});

async function loadData() {
    var data_id = document.getElementById('data_date').value
    const response = await fetch("/get_data?timestamp="+data_id);
    const data = await response.json();
    return data
}

document.addEventListener("DOMContentLoaded", async function() {
      const data = await loadData();
      updateData(data, initialDateStr);
      update()
    });