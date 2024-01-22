package com.crypto.controller;

import com.crypto.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

	@Autowired
	IndexService indexService;
	
	@RequestMapping("/")
	public String index(Model model) {
		model.addAttribute("marketInfo", indexService.selectMarketInfo());
		return "/index";
	}
}
