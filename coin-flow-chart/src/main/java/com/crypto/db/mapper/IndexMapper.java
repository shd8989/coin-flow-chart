package com.crypto.db.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.crypto.model.IndexEntity;

@Mapper
public interface IndexMapper {
	
	List<IndexEntity> selectDataList();
	
	String updateCoinAllData(String data);
}
