package com.crypto.db.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.crypto.model.CoinEntity;

@Mapper
public interface IndexMapper {
	List<CoinEntity> selectCoinDetailList(String coinCode);
	
	int insertDetailCoinData(List<Map> list);
}
