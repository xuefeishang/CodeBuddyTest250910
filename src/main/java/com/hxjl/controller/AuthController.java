package com.hxjl.controller;

import com.hxjl.dto.LoginRequest;
import com.hxjl.dto.LoginResponse;
import com.hxjl.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<LoginResponse.UserInfo> getCurrentUser() {
        // 从SecurityContext获取当前用户信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            // 这里应该根据当前认证用户获取用户信息
            // 简化处理，返回空用户信息
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.status(401).build();
    }
    
    @GetMapping("/menus")
    public ResponseEntity<List<Object>> getUserMenus() {
        // 这里应该根据用户角色返回对应的菜单权限
        // 简化处理，返回空菜单列表
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/info")
    public ResponseEntity<String> getAuthInfo() {
        return ResponseEntity.ok("认证服务正常运行 - 请使用POST方法访问/login接口进行登录");
    }
}