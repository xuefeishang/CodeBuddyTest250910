package com.hxjl.service;

import com.hxjl.entity.User;
import com.hxjl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.Optional;

@Service
public class DatabaseInitService {
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * 应用启动完成后检查数据库初始化状态
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void checkAndInitDatabase() {
        try {
            // 首先检查数据库连接
            if (!checkDatabaseConnection()) {
                System.err.println("数据库连接失败，无法进行初始化检查");
                return;
            }
            
            // 检查管理员用户是否存在
            Optional<User> adminUser = userRepository.findByUsername("admin");
            
            if (adminUser.isEmpty()) {
                System.out.println("检测到数据库未初始化，开始执行初始化...");
                
                // 执行SQL脚本初始化
                executeInitScripts();
                
                System.out.println("数据库初始化完成！");
                System.out.println("默认管理员账号: admin");
                System.out.println("默认管理员密码: admin123");
            } else {
                System.out.println("数据库已初始化，跳过初始化过程");
                System.out.println("现有管理员账号: " + adminUser.get().getUsername());
            }
            
        } catch (Exception e) {
            System.err.println("数据库初始化检查失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * 执行数据库初始化脚本
     */
    private void executeInitScripts() {
        try {
            // 执行schema.sql创建表结构
            ResourceDatabasePopulator schemaPopulator = new ResourceDatabasePopulator();
            schemaPopulator.addScript(new ClassPathResource("schema.sql"));
            schemaPopulator.setContinueOnError(true); // 如果表已存在则继续
            
            // 执行data.sql初始化数据
            ResourceDatabasePopulator dataPopulator = new ResourceDatabasePopulator();
            dataPopulator.addScript(new ClassPathResource("data.sql"));
            dataPopulator.setContinueOnError(true); // 如果数据已存在则继续
            
            // 执行脚本
            schemaPopulator.execute(dataSource);
            dataPopulator.execute(dataSource);
            
        } catch (Exception e) {
            System.err.println("执行初始化脚本失败: " + e.getMessage());
            // 如果脚本执行失败，尝试手动创建管理员用户
            createAdminUserManually();
        }
    }
    
    /**
     * 手动创建管理员用户（备用方案）
     */
    private void createAdminUserManually() {
        try {
            // 检查是否已存在管理员用户
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRealName("系统管理员");
                admin.setEmail("admin@hxjl.com");
                admin.setPhone("13800138000");
                admin.setStatus(User.UserStatus.ACTIVE);
                
                userRepository.save(admin);
                System.out.println("手动创建管理员用户成功");
            }
        } catch (Exception e) {
            System.err.println("手动创建管理员用户失败: " + e.getMessage());
        }
    }
    
    /**
     * 检查数据库连接状态
     */
    public boolean checkDatabaseConnection() {
        try {
            dataSource.getConnection().close();
            return true;
        } catch (Exception e) {
            System.err.println("数据库连接失败: " + e.getMessage());
            return false;
        }
    }
}