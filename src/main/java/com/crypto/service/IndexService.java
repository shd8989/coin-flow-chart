package com.crypto.service;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.crypto.model.CandleEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.crypto.db.mapper.IndexMapper;
import com.crypto.model.CoinEntity;
import com.crypto.model.MarketEntity;

@Service
public class IndexService {

	@Autowired
	IndexMapper indexMapper;

	public List<CoinEntity> selectCoinDetailList(String coinCode) {
		return indexMapper.selectCoinDetailList(coinCode);
	}
	
	public List<MarketEntity> selectMarketInfo() {
		List<MarketEntity> responseEntityList = new ArrayList<MarketEntity>();
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			HttpEntity entity = new HttpEntity(httpHeaders);
			
			RestTemplate restTemplate = new RestTemplate();
			// 코인 목록 정보
			String coinListUrl = "https://api.upbit.com/v1/market/all?isDetails=false";
			ResponseEntity<ArrayList> responseEntity = restTemplate.exchange(coinListUrl, HttpMethod.GET, entity, ArrayList.class);
			responseEntityList = (List) responseEntity.getBody().stream().filter(obj -> obj.toString().contains("KRW")).collect(Collectors.toList());
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return responseEntityList;
		}
		return responseEntityList;
	}

	public List<CandleEntity> selectCandleData(Map reqMap) {
		List<CandleEntity> candleResponseList = new ArrayList<CandleEntity>();
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			HttpEntity entity = new HttpEntity(httpHeaders);
			RestTemplate candleRestTemplate = new RestTemplate();
			String candleUrl = "";
			ResponseEntity<ArrayList> candleListResponseEntity;

			// candle 정보
			if("min".equals(reqMap.get("candleType"))) {
				candleUrl = "https://api.upbit.com/v1/candles/minutes/1?market=" + reqMap.get("market");
				if(reqMap.get("to") != null) {
					candleUrl += "&to=" + reqMap.get("to");
				}
				if(reqMap.get("candleCount") != null) {
					candleUrl += "&count=" + reqMap.get("candleCount");
				}
				candleListResponseEntity = candleRestTemplate.exchange(candleUrl, HttpMethod.GET, entity, ArrayList.class);
				candleResponseList = (List) candleListResponseEntity.getBody();
			} else if("day".equals(reqMap.get("candleType"))) {
				candleUrl = "https://api.upbit.com/v1/candles/days?market=" + reqMap.get("market");
				if(reqMap.get("to") != null) {
					candleUrl += "&to=" + reqMap.get("to");
				}
				if(reqMap.get("candleCount") != null) {
					candleUrl += "&count=" + reqMap.get("candleCount");
				}
				if(reqMap.get("convertingPriceUnit") != null) {
					candleUrl += "&convertingPriceUnit=" + reqMap.get("convertingPriceUnit");
				}
				candleListResponseEntity = candleRestTemplate.exchange(candleUrl, HttpMethod.GET, entity, ArrayList.class);
				candleResponseList = (List) candleListResponseEntity.getBody();
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return candleResponseList;
		}
		return candleResponseList;
	}
}
