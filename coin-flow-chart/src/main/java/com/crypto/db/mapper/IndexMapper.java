package com.crypto.db.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.crypto.model.IndexEntity;

@Mapper
public interface IndexMapper {
	
	List<IndexEntity> selectDataList();
	
	int updateCoinAllData(List<Map> list);
}
