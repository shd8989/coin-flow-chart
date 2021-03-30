package com.crypto.model;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class IndexEntity {
	@JsonProperty
	private String market;
	@JsonProperty
	private String korean_name;
	@JsonProperty
	private String english_name;
}