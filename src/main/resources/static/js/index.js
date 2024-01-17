//$(document).ready(function() {
//	$.ajax({
//        url: "/api/v1/detail",
//        type: "GET",
//        data: {coinCode: 'KRW-BTC'},
//        success: function(data){
//            console.log(data);
//            drawCandlestick(data, '비트코인');
//        },
//        error: function(){
//            alert("detail api err");
//        }
//    });
//});

function selectCoin(e) {
	var code = e.options[e.selectedIndex].value;
	var coinName = e.options[e.selectedIndex].text;
	
	$.ajax({
        url: "/api/v1/detail",
        type: "GET",
        data: {coinCode: code},
        success: function(data){
            console.log(data);
            drawCandlestick(data, coinName);
        },
        error: function(){
            alert("detail api err");
        }
    });
}

const upColor = '#00da3c';
const downColor = '#ec0000';

function splitData(rawData) {
//  tradeDateKst-tradeTimeKst
//  openingPrice
//  tradePrice
//  lowPrice
//  highPrice
//  accTradeVolume24h
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].tradeDateKst);
    values.push([rawData[i].openingPrice, rawData[i].tradePrice, rawData[i].lowPrice, rawData[i].highPrice, rawData[i].accTradeVolume24h]);
    volumes.push([i, rawData[i].accTradeVolume24h, rawData[i].openingPrice > rawData[i].tradePrice ? 1 : -1]);
    // categoryData(1) - tradeDateKst-tradeTimeKst
    // values(5) - open, close, low, high, volume
    // volumes(3) - accTradeVolume24h
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  };
}
function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

function drawCandlestick(rawData, coinName) {
    console.log('drawCandlestick');
//    console.log(rawData);
  var data = splitData(rawData);
  var candlestickChart = echarts.init(document.getElementById('candlestickChart'));
  candlestickChart.setOption(
    (option = {
      animation: false,
      legend: {
        bottom: 10,
        left: 'center',
        data: [coinName, 'MA5', 'MA10', 'MA20', 'MA30']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }
        // extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ],
        label: {
          backgroundColor: '#777'
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          brush: {
            type: ['lineX', 'clear']
          }
        }
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1
        }
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor
          },
          {
            value: -1,
            color: upColor
          }
        ]
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%'
        },
        {
          left: '10%',
          right: '8%',
          top: '63%',
          height: '16%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 98,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 98,
          end: 100
        }
      ],
      series: [
        {
          name: coinName,
          type: 'candlestick',
          data: data.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(20, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: calculateMA(30, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data.volumes
        }
      ]
    }),
    true
  );
  candlestickChart.dispatchAction({
    type: 'brush',
    areas: [
      {
        brushType: 'lineX',
        coordRange: ['2024-01-10', '2024-01-20'],
        xAxisIndex: 0
      }
    ]
  });
};