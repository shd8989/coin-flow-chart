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

function drawLineChart(data, coinName) {
	var xlabel = [];
	var xdata = [];
	
	var arr = data.filter((v) => {
		xlabel.push(v.timestamp.substring(0,10) + ' ' + v.timestamp.substring(11,19));
		xdata.push(v.openingPrice + v.signedChangePrice);
	});
	
	var yMaxValue = xdata.reduce((prev, cur) => {
		return prev > cur ? prev : cur;
	});
	var yMinValue = xdata.reduce((prev, cur) => {
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
	            data: xdata
	        },
	        /*
	        {
	            name: '联盟广告',
	            type: 'line',
	            data: [220, 182, 191, 234, 290, 330, 310]
	        }
	        */
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