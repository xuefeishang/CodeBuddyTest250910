package com.hxjl.repository;

import com.hxjl.entity.Tailings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TailingsRepository extends JpaRepository<Tailings, Long> {
}