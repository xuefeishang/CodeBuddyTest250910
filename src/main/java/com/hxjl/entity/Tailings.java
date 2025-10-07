package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_tailings")
@Data
public class Tailings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String tailingsName;
    
    private BigDecimal storageAmount;
    private String storageMethod;
    private String environmentalStatus;
    private String location;
    
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