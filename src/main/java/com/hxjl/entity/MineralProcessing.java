package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_mineral_processing")
@Data
public class MineralProcessing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String processName;
    
    private String oreType;
    private BigDecimal inputAmount;
    private BigDecimal outputAmount;
    private BigDecimal recoveryRate;
    private String status;
    private String operator;
    
    @Column(length = 2000)
    private String description;
    
    private LocalDateTime processDate;
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