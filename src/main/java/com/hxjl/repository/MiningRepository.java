package com.hxjl.repository;

import com.hxjl.entity.Mining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MiningRepository extends JpaRepository<Mining, Long> {
}