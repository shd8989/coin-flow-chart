package com.crypto.schedule;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.crypto.service.PriceService;

@Component
public class ScheduleController {
	@Autowired
	PriceService priceService;

//	@Scheduled(cron = "0 0/1 * * * *")
	@Scheduled(cron = "0/10 * * * * *")
	public void cronJobSchedule() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		Date now = new Date();
		String strDate = sdf.format(now);
		System.out.println(strDate);
		priceService.selectDataList();
	}
}
