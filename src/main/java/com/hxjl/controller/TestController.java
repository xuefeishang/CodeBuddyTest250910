package com.hxjl.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/public")
    public Map<String, Object> publicEndpoint() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "这是一个公开接口，无需认证");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> userEndpoint() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "这是一个用户接口，需要USER角色");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> adminEndpoint() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "这是一个管理员接口，需要ADMIN角色");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}