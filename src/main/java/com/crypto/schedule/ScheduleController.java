package com.crypto.schedule;

import com.crypto.model.MarketEntity;
import com.crypto.service.CronService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.crypto.service.IndexService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ScheduleController {
	@Autowired
	IndexService indexService;

	@Autowired
	CronService cronService;

	@Scheduled(cron = "0/10 * * * * *")
	public void cronJobSchedule() {
		List<MarketEntity> marketList = indexService.selectMarketInfo().stream().limit(30).collect(Collectors.toList());
		List<MarketEntity> subList1 = new ArrayList<>(marketList.subList(0, 10));
		List<MarketEntity> subList2 = new ArrayList<>(marketList.subList(10, 20));
		List<MarketEntity> subList3 = new ArrayList<>(marketList.subList(20, 30));
		Runnable task1 = () -> {
			cronService.cronDetailCoinData(subList1);
		};
		Runnable task2 = () -> {
			cronService.cronDetailCoinData(subList2);
		};
		Runnable task3 = () -> {
			cronService.cronDetailCoinData(subList3);
		};

		Thread subTread1 = new Thread(task1);
		Thread subTread2 = new Thread(task2);
		Thread subTread3 = new Thread(task3);
		try {
			subTread1.start();
            Thread.sleep(2000);
			subTread2.start();
			Thread.sleep(2000);
			subTread3.start();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
	}
}
