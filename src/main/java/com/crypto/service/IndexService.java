package com.crypto.service;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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

import net.bitnine.agensgraph.deps.org.json.simple.JSONArray;

@Service
public class IndexService {
	
	@Autowired
	IndexMapper indexMapper;
	
	public List<CoinEntity> selectCoinDetailList() {
		return indexMapper.selectCoinDetailList();
	}
	
	public int updateCoinAllData() {
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			HttpEntity entity = new HttpEntity(httpHeaders);
			
			RestTemplate coinRestTemplate = new RestTemplate();
			// 코인 목록 정보
//			https://api.upbit.com/v1/market/all
			ResponseEntity<JSONArray> coinResponseEntity = coinRestTemplate.exchange("https://api.upbit.com/v1/market/all", HttpMethod.GET, entity, JSONArray.class);
			List<IndexEntity> coinResponseList = (List) coinResponseEntity.getBody();
			Iterator itr = coinResponseList.iterator();
			List<Map> coinReqList = new ArrayList<Map>();
			int cnt = 0;
			
			while(itr.hasNext()) {
				Map map = (Map)itr.next();
				Map newMap = new HashMap();
				newMap.put("market", map.get("market"));
				coinReqList.add(newMap);
				cnt++;
				if(cnt >= 10) break;
			}

//			코인 상세정보
//			https://api.upbit.com/v1/ticker?markets=
			RestTemplate coinDetailRestTemplate = new RestTemplate();
			List<Map> coinDetailReqList = new ArrayList<Map>();
			for(int i=0; i<coinReqList.size(); i++) {
				ResponseEntity<JSONArray> coinDetailListResponseEntity = coinDetailRestTemplate.exchange("https://api.upbit.com/v1/ticker?markets="+coinReqList.get(i).get("market"), HttpMethod.GET, entity, JSONArray.class);
				List<IndexEntity> coinDetailResponseList = (List) coinDetailListResponseEntity.getBody();
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
//					newMap.put("timestamp", map.get("timestamp"));
					coinDetailReqList.add(newMap);
				}
			}
//			System.out.println(coinDetailReqList);
			return indexMapper.updateCoinAllData(coinDetailReqList);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return 0;
	}
}
