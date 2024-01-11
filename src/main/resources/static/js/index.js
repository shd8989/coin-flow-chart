/**
 * A sample source file for the code formatter preview
 */

$(document).ready(function() {
	$.ajax({
        url: "/api/v1/detail",
        type: "GET",
        data: {coinCode: 'KRW-BTC'},
        success: function(data){
            console.log(data);
            drawCandlestick(data);
        },
        error: function(){
            alert("detail api err");
        }
    });
});

function selectCoin(e) {
	var code = e.options[e.selectedIndex].value;
	var coinName = e.options[e.selectedIndex].text;
	
	$.ajax({
        url: "/api/v1/detail",
        type: "GET",
        data: {coinCode: code},
        success: function(data){
            console.log(data);
//            drawCandlestick(data, coinName);
        },
        error: function(){
            alert("detail api err");
        }
    });
}

//var upColor = '#ec0000';
//var upBorderColor = '#8A0000';
//var downColor = '#00da3c';
//var downBorderColor = '#008F28';
//
//function calculateMA(dayCount, resultList) {
//    var result = [];
//    for (var i = 0, len = resultList.length; i < len; i++) {
//        if (i < dayCount) {
//            result.push('-');
//            continue;
//        }
//        var sum = 0;
//        for (var j = 0; j < dayCount; j++) {
//            sum += resultList[i - j][1];
//        }
//        result.push(sum / dayCount);
//    }
//    return result;
//}

function drawLineChart(data, coinName) {
/*
	var dateList = [];
	var curPriceList = [];
	var openPriceList = [];
	var closePriceList = [];
	var lowPriceList = [];
	var highPriceList = [];
	var resultList = [];
	var tradeVolumeList = [];
//	values => date, open, close, low, high
	
	var arr = data.filter((v) => {
		dateList.push(v.tradeDateKst.substring(0,4) + '-' + v.tradeDateKst.substring(4,6)	 + '-' + v.tradeDateKst.substring(6,8)
						 + ' ' + v.tradeTimeKst.substring(0,2) + ':' + v.tradeTimeKst.substring(2,4) + ':' + v.tradeTimeKst.substring(4,6));
		curPriceList.push(v.openingPrice + v.signedChangePrice);
		openPriceList.push(v.openingPrice);
		closePriceList.push(v.prevClosingPrice);
		lowPriceList.push((v.highPrice+v.lowPrice)/2 * (1 - (v.tradeVolume < 1 ? v.tradeVolume : 1)));
		highPriceList.push((v.highPrice+v.lowPrice)/2 * (1 + (v.tradeVolume < 1 ? v.tradeVolume : 1)));
		tradeVolumeList.push((v.openingPrice + v.signedChangePrice) * (1 + v.tradeVolume));
	});
	for(var i=0; i<data.length; i++) {
		var subList = [];
		subList.push(openPriceList[i]);
		subList.push(closePriceList[i]);
		subList.push(lowPriceList[i]);
		subList.push(highPriceList[i]);
		resultList.push(subList);
	}
	console.log(tradeVolumeList)
	
	var yMaxValue = curPriceList.reduce((prev, cur) => {
    	console.log(prev, cur);
		return prev > cur ? prev : cur;
	});
	var yMinValue = curPriceList.reduce((prev, cur) => {
		return prev > cur ? cur : prev;
	});
	
	diff = setNumDiff(yMinValue, yMaxValue)
	yNewMinValue = setMinDigitNum(yMinValue)
	yNewMaxValue = setMaxDigitNum(yMaxValue)
	
	var lineChart = echarts.init(document.getElementById('lineChart'));
	var lineOption = null;
	lineOption = {
		title: {
	        text: coinName + ' 추이 차트'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    legend: {
	        data: ['현재가', 'MA1', 'MA5']
	    },
	    grid: {
	        left: '10%',
	        right: '10%',
	        bottom: '15%'
	    },
	    xAxis: {
	        type: 'category',
	        data: dateList,
	        scale: true,
	        boundaryGap: false,
	        axisLine: {onZero: false},
	        splitLine: {show: false},
	        splitNumber: 20,
	        min: 'dataMin',
	        max: 'dataMax'
	    },
	    yAxis: {
	        scale: true,
	        splitArea: {
	            show: true
	        }
	    },
	    dataZoom: [
	        {
	            type: 'inside',
	            start: 50,
	            end: 100
	        },
	        {
	            show: true,
	            type: 'slider',
	            top: '90%',
	            start: 50,
	            end: 100
	        }
	    ],
	    series: [
	        {
	            name: '현재가',
	            type: 'candlestick',
	            data: resultList,
	            itemStyle: {
	                color: upColor,
	                color0: downColor,
	                borderColor: upBorderColor,
	                borderColor0: downBorderColor
	            },
	            markPoint: {
	                label: {
	                    normal: {
	                        formatter: function (param) {
	                            return param != null ? Math.round(param.value) : '';
	                        }
	                    }
	                },
	                data: [
	                    {
	                        name: 'XX标点',
	                        coord: ['2023/5/31', 2300],
	                        value: 2300,
	                        itemStyle: {
	                            color: 'rgb(41,60,85)'
	                        }
	                    },
	                    {
	                        name: 'highest value',
	                        type: 'max',
	                        valueDim: 'highest'
	                    },
	                    {
	                        name: 'lowest value',
	                        type: 'min',
	                        valueDim: 'lowest'
	                    },
	                    {
	                        name: 'average value on close',
	                        type: 'average',
	                        valueDim: 'close'
	                    }
	                ],
	                tooltip: {
	                    formatter: function (param) {
	                        return param.name + '<br>' + (param.data.coord || '');
	                    }
	                }
	            },
	            markLine: {
	                symbol: ['none', 'none'],
	                data: [
	                    [
	                        {
	                            name: 'from lowest to highest',
	                            type: 'min',
	                            valueDim: 'lowest',
	                            symbol: 'circle',
	                            symbolSize: 10,
	                            label: {
	                                show: false
	                            },
	                            emphasis: {
	                                label: {
	                                    show: false
	                                }
	                            }
	                        },
	                        {
	                            type: 'max',
	                            valueDim: 'highest',
	                            symbol: 'circle',
	                            symbolSize: 10,
	                            label: {
	                                show: false
	                            },
	                            emphasis: {
	                                label: {
	                                    show: false
	                                }
	                            }
	                        }
	                    ],
	                    {
	                        name: 'min line on close',
	                        type: 'min',
	                        valueDim: 'close'
	                    },
	                    {
	                        name: 'max line on close',
	                        type: 'max',
	                        valueDim: 'close'
	                    }
	                ]
	            }
	        },
	        {
	            name: 'MA1',
	            type: 'line',
	            data: calculateMA(1, resultList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	        {
	            name: 'MA5',
	            type: 'line',
	            data: calculateMA(5, resultList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	    ]
	};
	lineChart.setOption(lineOption, true);
	*/
}

function drawBarChart(data) {
    console.log('drawBarChart');
    console.log(data);
    var barChart = echarts.init(document.getElementById('barChart'));
	var barOption = null;
    barOption = {
      title: {
        text: 'Accumulated Waterfall Chart'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          let tar;
          if (params[1] && params[1].value !== '-') {
            tar = params[1];
          } else {
            tar = params[2];
          }
          return tar && tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
      },
      legend: {
        data: ['Expenses', 'Income']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: (function () {
          let list = [];
          for (let i = 1; i <= 11; i++) {
            list.push('Nov ' + i);
          }
          return list;
        })()
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
        },
        {
          name: 'Income',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top'
          },
          data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
        },
        {
          name: 'Expenses',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom'
          },
          data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
        }
      ]
    };
    barChart.setOption(barOption, true);
    console.log(barOption);
}


const upColor = '#00da3c';
const downColor = '#ec0000';

function splitData(rawData) {
//  tradeDateKst-tradeTimeKst
//  prevClosingPrice
//  signedChangePrice
//  lowPrice
//  highPrice
//  accTradeVolume24h
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
      if(i == 0) {
      console.log(rawData[0]);
      }
    categoryData.push(rawData[i].tradeDateKst);
    values.push([rawData[i].prevClosingPrice, rawData[i].signedChangePrice, rawData[i].lowPrice, rawData[i].highPrice, rawData[i].accTradeVolume24h]);
    volumes.push([i, rawData[i].accTradeVolume24h, rawData[i].prevClosingPrice > rawData[i].signedChangePrice ? 1 : -1]);
    // categoryData(1) - tradeDateKst-tradeTimeKst
    // values(5) - prevClosingPrice, signedChangePrice, lowPrice, highPrice, accTradeVolume24h
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

function drawCandlestick(rawData) {
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
        data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
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
          name: 'Dow-Jones index',
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
        coordRange: ['2016-06-02', '2016-06-20'],
        xAxisIndex: 0
      }
    ]
  });
};







function setMinDigitNum(num) {
	var digit = 0;
	while(num > 10) {
		num = num / 10;
		digit++;
	}
	numFloorAbs = num - Math.floor(num);
	console.log(Math.floor(num), num, numFloorAbs)
	
	if(numFloorAbs < 0.5) {
		num = Math.floor(num);
	}
	else {
		num = Math.floor(num) + 0.5;
	}
	
	for(var j = 0; j < digit; j++) {
		num = num * 10
	}
	
	return num;
}
function setMaxDigitNum(num) {
	var digit = 0;
	while(num > 10) {
		num = num / 10;
		digit++;
	}
	numCeilAbs = Math.ceil(num) - num;
	console.log(Math.ceil(num), num, numCeilAbs)
	
	if(numCeilAbs > 0.5) {
		num = Math.ceil(num) - 0.5;
	}
	else {
		num = Math.ceil(num)
	}
	
	for(var j = 0; j < digit; j++) {
		num = num * 10
	}
	
	return num;
}
function setNumDiff(min, max) {
	var diff = max-min
	console.log(diff)
	
	var digit = 0;
	while(diff > 10) {
		diff = diff / 10;
		digit++;
	}
	numCeilAbs = Math.ceil(diff);
	
	for(var j = 0; j < digit; j++) {
		numCeilAbs = numCeilAbs * 10
	}
	
	return numCeilAbs;
}