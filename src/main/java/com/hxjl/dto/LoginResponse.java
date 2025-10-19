package com.hxjl.dto;

import lombok.Data;
import java.util.List;

@Data
public class LoginResponse {
    private String token;
    private UserInfo userInfo;
    
    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String realName;
        private String avatar;
        private String email;
        private String phone;
        private List<String> roles;
        private List<String> permissions;
    }
}