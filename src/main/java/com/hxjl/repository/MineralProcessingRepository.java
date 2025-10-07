package com.hxjl.repository;

import com.hxjl.entity.MineralProcessing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MineralProcessingRepository extends JpaRepository<MineralProcessing, Long> {
}