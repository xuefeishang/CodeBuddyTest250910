package com.hxjl.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("message", "华夏建龙企业级应用系统运行正常");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> result = new HashMap<>();
        result.put("name", "华夏建龙企业级应用系统");
        result.put("version", "1.0.0");
        result.put("description", "基于Spring Boot 3 + Vue的企业级管理系统");
        result.put("author", "华夏建龙技术团队");
        return result;
    }
}