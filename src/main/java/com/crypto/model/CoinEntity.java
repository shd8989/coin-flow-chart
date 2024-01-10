package com.crypto.model;
import java.math.BigInteger;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CoinEntity {
	@JsonProperty
	private String market;
	@JsonProperty
	private String tradeData;
	@JsonProperty
	private String tradeTime;
	@JsonProperty
	private String tradeDateKst;
	@JsonProperty
	private String tradeTimeKst;
	@JsonProperty
	private BigInteger tradeTimestamp;
	@JsonProperty
	private Double openingPrice;
	@JsonProperty
	private Double highPrice;
	@JsonProperty
	private Double lowPrice;
	@JsonProperty
	private Double accTradePrice;
	@JsonProperty
	private Double prevClosingPrice;
	@JsonProperty
	private String change;
	@JsonProperty
	private Double changePrice;
	@JsonProperty
	private Double changeRate;
	@JsonProperty
	private Double signedChangePrice;
	@JsonProperty
	private Double signedChangeRate;
	@JsonProperty
	private Double tradeVolume;
	@JsonProperty
	private Double accTradePrice24h;
	@JsonProperty
	private Double accTradeVolume;
	@JsonProperty
	private Double accTradeVolume24h;
	@JsonProperty
	private Double highest52WeekPrice;
	@JsonProperty
	private String highest52WeekDate;
	@JsonProperty
	private Double lowest52WeekPrice;
	@JsonProperty
	private String lowest52WeekDate;
	@JsonProperty
	private Timestamp timestp;
}