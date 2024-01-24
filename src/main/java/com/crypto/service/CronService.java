package com.crypto.service;

import com.crypto.db.mapper.IndexMapper;
import com.crypto.model.CoinEntity;
import com.crypto.model.MarketEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.*;

@Service
public class CronService {
    @Autowired
    IndexMapper indexMapper;

    public void cronDetailCoinData(List<MarketEntity> marketList) {
        try {
            // 1초에 10회씩 가능
            // 1. sleep을 통해 2초에 한번씩 5번 호출하거나
            // 2. stream offset같은 기능이 있다면 이를 활용
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
            HttpEntity entity = new HttpEntity(httpHeaders);

            // 코인 상세정보
            String coinDetailUrl = "https://api.upbit.com/v1/ticker?markets=";
            RestTemplate restTemplate = new RestTemplate();
            List<Map> coinDetailResList = new ArrayList<Map>();

            for (int i = 0; i < marketList.size(); i++) {
                ObjectMapper mapper = new ObjectMapper();
                MarketEntity obj = mapper.convertValue(marketList.get(i), MarketEntity.class);
                ResponseEntity<ArrayList> responseEntity = restTemplate.exchange(coinDetailUrl + obj.getMarket(), HttpMethod.GET, entity, ArrayList.class);
                List<CoinEntity> responseList = (List) responseEntity.getBody();
                Iterator itr1 = responseList.iterator();

                while (itr1.hasNext()) {
                    Map map = (Map) itr1.next();
                    Map newMap = new HashMap();
                    newMap.put("market", map.get("market"));
                    newMap.put("opening_price", map.get("opening_price"));
                    newMap.put("high_price", map.get("high_price"));
                    newMap.put("low_price", map.get("low_price"));
                    newMap.put("trade_price", map.get("trade_price"));
                    newMap.put("change", map.get("change"));
                    newMap.put("trade_volume", map.get("trade_volume"));
                    newMap.put("acc_trade_volume", map.get("acc_trade_volume"));
                    newMap.put("acc_trade_volume_24h", map.get("acc_trade_volume_24h"));
                    newMap.put("timestp", map.get("timestp"));
                    coinDetailResList.add(newMap);
                }
            }
            indexMapper.insertDetailCoinData(coinDetailResList);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}