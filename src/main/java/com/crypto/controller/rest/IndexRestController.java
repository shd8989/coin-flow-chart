package com.crypto.controller.rest;

import java.util.List;
import java.util.Map;

import com.crypto.model.CandleEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.model.CoinEntity;
import com.crypto.service.IndexService;

@RestController
@RequestMapping("/api/v1")
public class IndexRestController {
	
	@Autowired
	IndexService indexService;
	
	@RequestMapping("/detail")
	public List<CoinEntity> selectCoinDetailList(@RequestParam(value="coinCode", required=false) String coinCode) {
		return indexService.selectCoinDetailList(coinCode);
	}

	@RequestMapping("/candleData")
	public List<CandleEntity> selectCandleData(@RequestParam(value="market", required=false) String market, @RequestParam(value="candleCount", required=false) int candleCount) {
		return indexService.selectCandleData(market, candleCount);
	}
}
