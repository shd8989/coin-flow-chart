package com.crypto.model;
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
	private String trade_date;
	@JsonProperty
	private String trade_time;
	@JsonProperty
	private String trade_date_kst;
	@JsonProperty
	private String trade_time_kst;
	@JsonProperty
	private Timestamp trade_timestamp;
	@JsonProperty
	private Double opening_price;
	@JsonProperty
	private Double high_price;
	@JsonProperty
	private Double low_price;
	@JsonProperty
	private Double trade_price;
	@JsonProperty
	private Double prev_closing_price;
	@JsonProperty
	private String change;
	@JsonProperty
	private Double change_price;
	@JsonProperty
	private Double change_rate;
	@JsonProperty
	private Double signed_change_price;
	@JsonProperty
	private Double signed_change_rate;
	@JsonProperty
	private Double trade_volume;
	@JsonProperty
	private Double acc_trade_price;
	@JsonProperty
	private Double acc_trade_price_24h;
	@JsonProperty
	private Double acc_trade_volume;
	@JsonProperty
	private Double acc_trade_volume_24h;
	@JsonProperty
	private Double highest_52_week_price;
	@JsonProperty
	private Double highest_52_week_date;
	@JsonProperty
	private Double lowest_52_week_price;
	@JsonProperty
	private String lowest_52_week_date;
	@JsonProperty
	private Timestamp timestamp;
}