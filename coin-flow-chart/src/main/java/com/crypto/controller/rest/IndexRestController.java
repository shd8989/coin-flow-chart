package com.crypto.controller.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.model.CoinEntity;
import com.crypto.service.IndexService;

@RestController
@RequestMapping("/api/v1")
public class IndexRestController {
	
	@Autowired
	IndexService indexService;
	
	@RequestMapping("/detail")
	public List<CoinEntity> selectCoinDetailList(/* @RequestParam(value="param1", required=false) String param1 */) {
		return indexService.selectCoinDetailList();
	}
}
