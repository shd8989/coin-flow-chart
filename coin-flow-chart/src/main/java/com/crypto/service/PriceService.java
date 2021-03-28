package com.crypto.service;

import java.nio.charset.Charset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.crypto.db.mapper.IndexMapper;

@Service
public class PriceService {
	
	@Autowired
	IndexMapper indexMapper;
	
	public void selectDataList() {
		
		try {
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
			
			HttpEntity entity = new HttpEntity(httpHeaders);
			
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.exchange("https://api.upbit.com/v1/market/all", HttpMethod.GET, entity, String.class);
			
			System.out.println(responseEntity.getBody());
//			return indexMapper.updateCoinAllData(responseEntity.getBody());
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
//		return "";
	}
}
