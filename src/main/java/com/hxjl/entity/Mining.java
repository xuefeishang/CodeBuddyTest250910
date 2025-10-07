package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_mining")
@Data
public class Mining {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String mineName;
    
    private String mineType;
    private BigDecimal dailyOutput;
    private BigDecimal totalReserves;
    private String status;
    private String location;
    
    @Column(length = 2000)
    private String description;
    
    private LocalDateTime miningDate;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
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