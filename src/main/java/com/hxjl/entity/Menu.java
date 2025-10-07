package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sys_menu")
@Data
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String path;
    private String component;
    private String icon;
    private Integer sort;
    
    @Enumerated(EnumType.STRING)
    private MenuType type;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Menu parent;
    
    @OneToMany(mappedBy = "parent")
    private List<Menu> children;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    public enum MenuType {
        DIRECTORY, MENU, BUTTON
    }
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}