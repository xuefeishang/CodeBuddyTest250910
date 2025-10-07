package com.hxjl.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "crm_contract")
@Data
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String contractNumber;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    private BigDecimal amount;
    private String type;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @Column(length = 2000)
    private String terms;
    
    @Column(length = 1000)
    private String description;
    
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