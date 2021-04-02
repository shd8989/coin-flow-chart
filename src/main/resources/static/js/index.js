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
//            drawLineChart(response, response2, sigunguList, tradeType, sido, selected);
            drawLineChart(data, '비트코인');
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
            drawLineChart(data, coinName);
        },
        error: function(){
            alert("detail api err");
        }
    });
}

function drawLineChart1(data, coinName) {
	var xlabel = [];
	var curPriceList = [];
	
	var arr = data.filter((v) => {
		xlabel.push(v.timestamp.substring(0,10) + ' ' + v.timestamp.substring(11,19));
		curPriceList.push(v.openingPrice + v.signedChangePrice);
	});
	
	var yMaxValue = curPriceList.reduce((prev, cur) => {
		return prev > cur ? prev : cur;
	});
	var yMinValue = curPriceList.reduce((prev, cur) => {
		return prev > cur ? cur : prev;
	});
	
	diff = setNumDiff(yMinValue, yMaxValue)
	yNewMinValue = setMinDigitNum(yMinValue)
	yNewMaxValue = setMaxDigitNum(yMaxValue)
	console.log(yNewMaxValue, yNewMinValue, yMaxValue, yMinValue, diff)
	/*
	if(yNewMaxValue - yNewMinValue > diff) {
		yNewMaxValue = yNewMinValue + diff;
	}
	else if(yMaxValue - yMinValue < diff) {
		yNewMaxValue = yNewMaxValue - diff;
	}
	if(yNewMinValue < yMinValue) {
		yNewMinValue = yNewMaxValue - diff;
	}
	*/
	console.log(yNewMaxValue, yNewMinValue, yMaxValue, yMinValue, diff)
	
	var lineChart = echarts.init(document.getElementById('lineChart'));
	var lineOption = null;
	lineOption = {
		title: {
        	text: coinName + ' 추이 차트'
	    },
	    tooltip: {
	        trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#505765'
				}
			}
	    },
	    /*
	    legend: {
	        data: ['KRW-BTC']
	    },
	    */
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: 80,
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    dataZoom: [
			{
				show: true,
				realtime: true,
				start: 80,
				end: 100
			},
			{
				type: 'inside',
				realtime: true,
				start: 80,
				end: 100
			}
		],
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: xlabel
	    },
	    yAxis: {
	        type: 'value',
	        min: yNewMinValue,
	        max: yNewMaxValue
	    },
	    series: [
	        {
	            name: 'KRW-BTC',
	            type: 'line',
	            data: curPriceList
	        }
	    ]
	};
	lineChart.setOption(lineOption, true);
}



var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';

function splitData(rawData) {
    var values = []
    for (var i = 0; i < rawData.length; i++) {
//        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
    }
    return {
        values: values
    };
}

function calculateMA(dayCount, tradeVolumeList) {
    var result = [];
    for (var i = 0, len = tradeVolumeList.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += tradeVolumeList[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}

function drawLineChart(data, coinName) {
	var dateList = [];
	var curPriceList = [];
	var openPriceList = [];
	var closePriceList = [];
	var lowPriceList = [];
	var highPriceList = [];
	var tradeVolumeList = [];
//	values => date, open, close, low, high
	
	var arr = data.filter((v) => {
		dateList.push(v.timestamp.substring(0,10) + ' ' + v.timestamp.substring(11,19));
		curPriceList.push(v.openingPrice + v.signedChangePrice);
		openPriceList.push(v.openingPrice);
		closePriceList.push(v.prevClosingPrice);
		lowPriceList.push(v.lowPrice);
		highPriceList.push(v.highPrice);
//		tradeVolumeList.push(v.tradeVolume);
	});
	for(var i=0; i<data.length; i++) {
		var subList = [];
		subList.push(dateList[i]);
		subList.push(openPriceList[i]);
		subList.push(closePriceList[i]);
		subList.push(lowPriceList[i]);
		subList.push(highPriceList[i]);
		tradeVolumeList.push(subList);
	}
	console.log(tradeVolumeList)
	
	var yMaxValue = curPriceList.reduce((prev, cur) => {
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
	        data: ['현재가', 'MA5', 'MA10', 'MA20', 'MA30']
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
	            data: tradeVolumeList,
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
	                        coord: ['2013/5/31', 2300],
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
	            name: 'MA5',
	            type: 'line',
	            data: calculateMA(5, tradeVolumeList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	        {
	            name: 'MA10',
	            type: 'line',
	            data: calculateMA(10, tradeVolumeList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	        {
	            name: 'MA20',
	            type: 'line',
	            data: calculateMA(20, tradeVolumeList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	        {
	            name: 'MA30',
	            type: 'line',
	            data: calculateMA(30, tradeVolumeList),
	            smooth: true,
	            lineStyle: {
	                opacity: 0.5
	            }
	        },
	    ]
	};
	lineChart.setOption(lineOption, true);
}












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