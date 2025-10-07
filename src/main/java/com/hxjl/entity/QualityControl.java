package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_quality_control")
@Data
public class QualityControl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String productName;
    
    private String batchNumber;
    private BigDecimal purity;
    private String qualityGrade;
    private String inspector;
    private String status;
    
    @Column(length = 2000)
    private String description;
    
    private LocalDateTime inspectionDate;
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