package com.hxjl.service;

import com.hxjl.dto.LoginRequest;
import com.hxjl.dto.LoginResponse;
import com.hxjl.entity.User;
import com.hxjl.repository.UserRepository;
import com.hxjl.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepository userRepository;
    
  
    
    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByUsernameWithRoles(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        String jwt = jwtUtil.generateToken(
            org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password("")
                .authorities(authentication.getAuthorities())
                .build()
        );
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setRealName(user.getRealName());
        userInfo.setAvatar(user.getAvatar() != null ? user.getAvatar() : "/images/default-avatar.png");
        userInfo.setEmail(user.getEmail());
        userInfo.setPhone(user.getPhone());
        // 设置角色和权限信息
        userInfo.setRoles(user.getRoles().stream().map(role -> role.getRoleName()).toList());
        // 简化处理权限，使用角色名称作为权限标识
        userInfo.setPermissions(user.getRoles().stream()
            .map(role -> "ROLE_" + role.getRoleName().toUpperCase())
            .toList());
        
        LoginResponse response = new LoginResponse();
        response.setToken(jwt);
        response.setUserInfo(userInfo);
        
        return response;
    }
    
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}