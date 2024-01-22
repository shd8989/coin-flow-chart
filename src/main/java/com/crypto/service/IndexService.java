package com.crypto.service;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.crypto.model.CandleEntity;
import org.json.*;

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
import com.crypto.model.IndexEntity;

@Service
public class IndexService {

	@Autowired
	IndexMapper indexMapper;

	public List<CoinEntity> selectCoinDetailList(String coinCode) {
		return indexMapper.selectCoinDetailList(coinCode);
	}
	
	public void getAllCoinData() {
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			HttpEntity entity = new HttpEntity(httpHeaders);
			
			RestTemplate coinRestTemplate = new RestTemplate();
			// 코인 목록 정보
			String coinListUrl = "https://api.upbit.com/v1/market/all";
			ResponseEntity<ArrayList> coinResponseEntity = coinRestTemplate.exchange(coinListUrl, HttpMethod.GET, entity, ArrayList.class);
			List<IndexEntity> coinResponseList = (List) coinResponseEntity.getBody();
			Iterator itr = coinResponseList.iterator();
			
			List<Map> allCoinList = new ArrayList<Map>();
			while (itr.hasNext()) {
				Map map = (Map) itr.next();
				Map newMap = new HashMap();
				newMap.put("market", map.get("market"));
				allCoinList.add(newMap);
			}
			List<Map> krwList = new ArrayList<>();
			for(int i=0; i<allCoinList.size(); i++) {
				Map newMap = new HashMap();
				if(allCoinList.get(i).get("market").toString().contains("KRW")) {
					newMap.put("market", allCoinList.get(i).get("market"));
					krwList.add(newMap);
				}
			}

			Iterator itr2 = krwList.iterator();
			List<Map> list = new ArrayList<>();
			for(int i=0; i<30; i++) {
				Map map = (Map)itr2.next();
				list.add(map);
				if(i%10 == 9) {
					detailCoinData(list);
					list = new ArrayList<>();
					Thread.sleep(1000);
				}
			}
				
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	public int detailCoinData(List<Map> coinReqList) {
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			HttpEntity entity = new HttpEntity(httpHeaders);
			
	//		코인 상세정보
			String coinDetailUrl = "https://api.upbit.com/v1/ticker?markets=";
			RestTemplate coinDetailRestTemplate = new RestTemplate();
			List<Map> coinDetailResList = new ArrayList<Map>();
			for(int i=0; i<coinReqList.size(); i++) {
				ResponseEntity<ArrayList> coinDetailListResponseEntity = coinDetailRestTemplate.exchange(coinDetailUrl+coinReqList.get(i).get("market"), HttpMethod.GET, entity, ArrayList.class);
				List<CoinEntity> coinDetailResponseList = (List) coinDetailListResponseEntity.getBody();
				Iterator itr1 = coinDetailResponseList.iterator();
				
				while(itr1.hasNext()) {
					Map map = (Map)itr1.next();
					Map newMap = new HashMap();
					newMap.put("market", map.get("market"));
					newMap.put("trade_date", map.get("trade_date"));
					newMap.put("trade_time", map.get("trade_time"));
					newMap.put("trade_date_kst", map.get("trade_date_kst"));
					newMap.put("trade_time_kst", map.get("trade_time_kst"));
					newMap.put("trade_timestamp", map.get("trade_timestamp"));
					newMap.put("opening_price", map.get("opening_price"));
					newMap.put("high_price", map.get("high_price"));
					newMap.put("low_price", map.get("low_price"));
					newMap.put("trade_price", map.get("trade_price"));
					newMap.put("prev_closing_price", map.get("prev_closing_price"));
					newMap.put("change", map.get("change"));
					newMap.put("change_price", map.get("change_price"));
					newMap.put("change_rate", map.get("change_rate"));
					newMap.put("signed_change_price", map.get("signed_change_price"));
					newMap.put("signed_change_rate", map.get("signed_change_rate"));
					newMap.put("trade_volume", map.get("trade_volume"));
					newMap.put("acc_trade_price", map.get("acc_trade_price"));
					newMap.put("acc_trade_price_24h", map.get("acc_trade_price_24h"));
					newMap.put("acc_trade_volume", map.get("acc_trade_volume"));
					newMap.put("acc_trade_volume_24h", map.get("acc_trade_volume_24h"));
					newMap.put("highest_52_week_price", map.get("highest_52_week_price"));
					newMap.put("highest_52_week_date", map.get("highest_52_week_date"));
					newMap.put("lowest_52_week_price", map.get("lowest_52_week_price"));
					newMap.put("lowest_52_week_date", map.get("lowest_52_week_date"));
					newMap.put("timestp", map.get("timestp"));
					coinDetailResList.add(newMap);
				}
			}
			return indexMapper.updateCoinAllData(coinDetailResList);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return 0;
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
