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

//function drawLineChart(data, xlabel, sigunguList, tradeType, sido, selected) {
function drawLineChart(data, coinName) {
	var xlabel = [];
	var xdata = [];
	
	var arr = data.filter((v) => {
		xlabel.push(v.timestamp);
		xdata.push(v.openingPrice + v.signedChangePrice);
	});
	
	var yMaxValue = xdata.reduce((prev, cur) => {
		return prev > cur ? prev : cur;
	});
	var yMinValue = xdata.reduce((prev, cur) => {
		return prev > cur ? cur : prev;
	});
	
	yMinValue = setMinDigitNum(yMinValue)
	yMaxValue = setMaxDigitNum(yMaxValue)
	
	var lineChart = echarts.init(document.getElementById('lineChart'));
	var lineOption = null;
	lineOption = {
		title: {
        	text: coinName + ' 추이 차트'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    /*
	    legend: {
	        data: ['KRW-BTC']
	    },
	    */
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: xlabel
	    },
	    yAxis: {
	        type: 'value',
	        min: yMinValue,
	        max: yMaxValue
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
	num = Math.floor(num);
	
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
	num = Math.ceil(num);
	
	for(var j = 0; j < digit; j++) {
		num = num * 10
	}
	
	return num;
}