/**
 * A sample source file for the code formatter preview
 */

$(document).ready(function() {
	console.log('api')
	$.ajax({
        url: "/api/v1/detail",
        type: "GET",
        data: $('form').serialize(),
        success: function(data){
            console.log('success');
            console.log(data);
//            drawLineChart(response, response2, sigunguList, tradeType, sido, selected);
            drawLineChart(data);
        },
        error: function(){
            alert("detail api err");
        }
    });
});

//function drawLineChart(data, xlabel, sigunguList, tradeType, sido, selected) {
function drawLineChart(data) {
	var xlabel = [];
	var xdata = [];
	var arr = data.filter((v) => {
		xlabel.push(v.timestamp);
		xdata.push(v.openingPrice + v.signedChangePrice);
		console.log(v)
	})
	console.log(xdata)
	
	var yValueMax = 0;
	function arrayMax(arr) {
		var len = arr.length;
		while(len--) {
			if(arr[len].price > yValueMax) {
				yValueMax = arr[len].price;
			}
		}
	}
//	arrayMax(ydata)
	
	var lineChart = echarts.init(document.getElementById('lineChart'));
	var lineOption = null;
	lineOption = {
		title: {
        	text: '비트코인 추이 차트'
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
	        min: 65000000
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