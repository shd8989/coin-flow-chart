package com.crypto.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.crypto.service.IndexService;

@Component
public class ScheduleController {
	@Autowired
	IndexService indexService;

//	@Scheduled(cron = "0/20 * * * * *")
//	public void cronJobSchedule() {
//		indexService.getAllCoinData();
//	}
}
