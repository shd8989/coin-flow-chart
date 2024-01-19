package com.crypto.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigInteger;
import java.sql.Timestamp;

@Getter
@Setter
@ToString
public class CandleEntity {
	@JsonProperty
	private String market;
	@JsonProperty
	private String candle_date_time_utc;
	@JsonProperty
	private String candle_date_time_kst;
	@JsonProperty
	private Double opening_price;
	@JsonProperty
	private Double high_price;
	@JsonProperty
	private Double low_price;
	@JsonProperty
	private Double trade_price;
	@JsonProperty
	private Long timestp;
	@JsonProperty
	private Double candle_acc_trade_price;
	@JsonProperty
	private Double candle_acc_trade_volume;
	@JsonProperty
	private Integer unit;
}